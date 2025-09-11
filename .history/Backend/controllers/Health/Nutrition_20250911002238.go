package Health

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
		Goal                string  `json:"goal"`
		TotalCaloriesPerDay float64 `json:"total_calories_per_day"`
		Note                string  `json:"note"`
		Date                string  `json:"date"`
		ProteinG            float64 `json:"protein_g"`
		FatG                float64 `json:"fat_g"`
		CarbG               float64 `json:"carb_g"`
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

	// ใช้ข้อมูลมาโครที่ส่งมา หรือคำนวณถ้าไม่ได้ส่งมา
	var proteinG, fatG, carbG float64
	if body.ProteinG > 0 && body.FatG > 0 && body.CarbG > 0 {
		// ใช้ข้อมูลที่ส่งมา
		proteinG = body.ProteinG
		fatG = body.FatG
		carbG = body.CarbG
	} else {
		// คำนวณมาโครอัตโนมัติ
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
		// Update existing nutrition
		nutrition.Goal = body.Goal
		nutrition.TotalCaloriesPerDay = body.TotalCaloriesPerDay
		nutrition.Note = body.Note
		db.Save(&nutrition)

		// Update or create meal record
		var meal entity.Meal
		if err := db.Where("nutrition_id = ?", nutrition.ID).First(&meal).Error; err == nil {
			// Update existing meal
			meal.ProteinG = proteinG
			meal.FatG = fatG
			meal.CarbG = carbG
			db.Save(&meal)
		} else {
			// Create new meal
			meal = entity.Meal{
				NutritionID: nutrition.ID,
				UserID:      userID,
				ProteinG:    proteinG,
				FatG:        fatG,
				CarbG:       carbG,
			}
			db.Create(&meal)
		}
	} else {
		// Create new nutrition
		nutrition = entity.Nutrition{
			UserID:              userID,
			Date:                body.Date,
			Goal:                body.Goal,
			TotalCaloriesPerDay: body.TotalCaloriesPerDay,
			Note:                body.Note,
		}
		if err := db.Create(&nutrition).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create"})
			return
		}

		// Create meal record
		meal := entity.Meal{
			NutritionID: nutrition.ID,
			UserID:      userID,
			ProteinG:    proteinG,
			FatG:        fatG,
			CarbG:       carbG,
		}
		db.Create(&meal)
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
		// ดึงข้อมูล meal เพื่อเพิ่มมาโคร
		var meal entity.Meal
		if err := db.Where("nutrition_id = ?", nutritionData.ID).First(&meal).Error; err == nil {
			// สร้าง nutrition object ที่มีมาโคร
			nutritionWithMacros := gin.H{
				"ID":                     nutritionData.ID,
				"CreatedAt":              nutritionData.CreatedAt,
				"UpdatedAt":              nutritionData.UpdatedAt,
				"DeletedAt":              nutritionData.DeletedAt,
				"user_id":                nutritionData.UserID,
				"date":                   nutritionData.Date,
				"goal":                   nutritionData.Goal,
				"total_calories_per_day": nutritionData.TotalCaloriesPerDay,
				"note":                   nutritionData.Note,
				"protein_g":              meal.ProteinG,
				"fat_g":                  meal.FatG,
				"carb_g":                 meal.CarbG,
			}
			response["data"] = nutritionWithMacros
		}
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
		c.JSON(http.StatusOK, gin.H{"data": []entity.Nutrition{}})
		return
	}

	// ดึงข้อมูลมาโครจาก meal table
	var meal entity.Meal
	if err := db.Where("nutrition_id = ?", nutrition.ID).First(&meal).Error; err == nil {
		// สร้าง nutrition object ที่มีมาโคร
		nutritionWithMacros := gin.H{
			"ID":                     nutrition.ID,
			"CreatedAt":              nutrition.CreatedAt,
			"UpdatedAt":              nutrition.UpdatedAt,
			"DeletedAt":              nutrition.DeletedAt,
			"user_id":                nutrition.UserID,
			"date":                   nutrition.Date,
			"goal":                   nutrition.Goal,
			"total_calories_per_day": nutrition.TotalCaloriesPerDay,
			"note":                   nutrition.Note,
			"protein_g":              meal.ProteinG,
			"fat_g":                  meal.FatG,
			"carb_g":                 meal.CarbG,
		}
		c.JSON(http.StatusOK, gin.H{"data": nutritionWithMacros})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": nutrition})
}
