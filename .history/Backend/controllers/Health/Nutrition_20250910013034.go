package health

import (
	"net/http"
	"time"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"github.com/gin-gonic/gin"
)

// POST /api/nutrition
func CreateOrUpdateNutrition(c *gin.Context) {
	var body struct {
		Goal                string        `json:"goal"`
		TotalCaloriesPerDay float64       `json:"total_calories_per_day"`
		Note                string        `json:"note"`
		Date                string        `json:"date"`
		Meals               []entity.Meal `json:"meals"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	userIDRaw, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDRaw.(uint)

	if body.Date == "" {
		body.Date = time.Now().Format("2006-01-02")
	}

	db := config.DB()

	// หากไม่ส่งแคลอรี่ต่อวันมา หรือส่งมาน้อยกว่าหรือเท่ากับ 0 ให้คำนวณให้อัตโนมัติจากข้อมูลสุขภาพล่าสุดและเพศ
	if body.TotalCaloriesPerDay <= 0 {
		var user entity.Users
		db.First(&user, userID)

		var latestHealth entity.Health
		db.Where("user_id = ?", userID).Order("date desc").First(&latestHealth)

		weight := float64(latestHealth.Weight)
		height := float64(latestHealth.Height)
		age := int(user.Age)
		isMale := user.GenderID == 1 // ปรับตามค่าเพศในระบบของคุณ

		// สูตร Mifflin-St Jeor
		s := 5.0
		if !isMale {
			s = -161.0
		}
		bmr := 10*weight + 6.25*height - 5*float64(age) + s
		if bmr < 800 {
			bmr = 800
		}
		// สมมติระดับกิจกรรม Light
		tdee := bmr * 1.375

		switch body.Goal {
		case "ลดน้ำหนัก", "cut", "loss":
			tdee = tdee * 0.85
		case "เพิ่มกล้ามเนื้อ", "bulk", "gain":
			tdee = tdee * 1.10
		}

		body.TotalCaloriesPerDay = float64(int(tdee))
	}

	// คำนวณมาโคร
	var proteinG, fatG, carbG float64
	{
		var user entity.Users
		db.First(&user, userID)
		var latestHealth entity.Health
		db.Where("user_id = ?", userID).Order("date desc").First(&latestHealth)

		if latestHealth.ID != 0 {
			isMale := user.GenderID == 1
			proteinPerKg := 1.4
			if isMale {
				proteinPerKg = 1.6
			}
			proteinG = latestHealth.Weight * proteinPerKg
			fatKcal := body.TotalCaloriesPerDay * 0.25
			fatG = fatKcal / 9.0
			carbKcal := body.TotalCaloriesPerDay - (proteinG * 4) - fatKcal
			carbG = carbKcal / 4.0
		}
	}

	// upsert nutrition by user/date
	var nutrition entity.Nutrition
	if err := db.Where("user_id = ? AND date = ?", userID, body.Date).First(&nutrition).Error; err == nil {
		nutrition.Goal = body.Goal
		nutrition.TotalCaloriesPerDay = body.TotalCaloriesPerDay
		nutrition.ProteinG = proteinG
		nutrition.FatG = fatG
		nutrition.CarbG = carbG
		nutrition.Note = body.Note
		db.Save(&nutrition)
		// replace meals
		db.Where("nutrition_id = ?", nutrition.ID).Delete(&entity.Meal{})
		for _, m := range body.Meals {
			m.NutritionID = nutrition.ID
			m.UserID = userID
			if m.Date.IsZero() {
				m.Date = time.Now()
			}
			db.Create(&m)
		}
	} else {
		nutrition = entity.Nutrition{
			UserID:              userID,
			Date:                body.Date,
			Goal:                body.Goal,
			TotalCaloriesPerDay: body.TotalCaloriesPerDay,
			ProteinG:            proteinG,
			FatG:                fatG,
			CarbG:               carbG,
			Note:                body.Note,
		}
		if err := db.Create(&nutrition).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create"})
			return
		}
		for _, m := range body.Meals {
			m.NutritionID = nutrition.ID
			m.UserID = userID
			if m.Date.IsZero() {
				m.Date = time.Now()
			}
			db.Create(&m)
		}
	}

	// สร้าง response macros
	respMacros := gin.H{
		"protein_g": int(proteinG + 0.5),
		"fat_g":     int(fatG + 0.5),
		"carb_g":    int(carbG + 0.5),
	}

	// รวมข้อมูลมาโครใน response
	response := gin.H{
		"data":   nutrition,
		"macros": respMacros,
	}

	// เพิ่มข้อมูลมาโครใน nutrition object เพื่อให้ frontend ใช้งานได้
	if nutritionData, ok := response["data"].(entity.Nutrition); ok {
		nutritionData.ProteinG = proteinG
		nutritionData.FatG = fatG
		nutritionData.CarbG = carbG
		response["data"] = nutritionData
	}

	c.JSON(http.StatusOK, response)
}

// GET /api/nutrition?date=YYYY-MM-DD
func GetNutrition(c *gin.Context) {
	userIDRaw, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDRaw.(uint)

	date := c.Query("date")

	db := config.DB()
	var nutrition entity.Nutrition
	tx := db.Where("user_id = ?", userID)
	if date != "" {
		tx = tx.Where("date = ?", date)
	}
	if err := tx.Preload("Meals").Order("date desc").First(&nutrition).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"data": [entity.Nutrition]})
		return
	}

	// คำนวณมาโครสำหรับ response (ถ้าไม่มีข้อมูลมาโครใน DB)
	if nutrition.ProteinG == 0 && nutrition.FatG == 0 && nutrition.CarbG == 0 {
		var user entity.Users
		db.First(&user, userID)
		var latestHealth entity.Health
		db.Where("user_id = ?", userID).Order("date desc").First(&latestHealth)

		if latestHealth.ID != 0 {
			isMale := user.GenderID == 1
			proteinPerKg := 1.4
			if isMale {
				proteinPerKg = 1.6
			}
			proteinG := latestHealth.Weight * proteinPerKg
			fatKcal := nutrition.TotalCaloriesPerDay * 0.25
			fatG := fatKcal / 9.0
			carbKcal := nutrition.TotalCaloriesPerDay - (proteinG * 4) - fatKcal
			carbG := carbKcal / 4.0

			nutrition.ProteinG = proteinG
			nutrition.FatG = fatG
			nutrition.CarbG = carbG
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": nutrition})
}
