package Health

import (
	"net/http"
	"time"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"github.com/gin-gonic/gin"
)

// POST /api/activity/
func CreateActivity(c *gin.Context) {
	var activity entity.Activity
	if err := c.ShouldBindJSON(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// ✅ ดึง user_id จาก context (JWT)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userID := userIDInterface.(uint)

	db := config.DB()

	// ✅ หา Health ล่าสุดของ user
	var latestHealth entity.Health
	if err := db.Where("user_id = ?", userID).Order("date desc").First(&latestHealth).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No health record found for user"})
		return
	}

	// ✅ คำนวณ Calories จาก MET
	MET := 5.0
	switch activity.Type {
	case "วิ่ง":
		MET = 9.8
	case "เดิน":
		MET = 3.5
	case "ปั่นจักรยาน":
		MET = 7.5
	}

	activity.UserID = userID
	activity.HealthID = latestHealth.ID
	// แปลงนาทีเป็นชั่วโมงสำหรับการคำนวณแคลอรี่
	durationInHours := activity.Duration / 60.0
	activity.Calories = MET * latestHealth.Weight * durationInHours
	activity.Date = time.Now()

	if err := db.Create(&activity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create activity"})
		return
	}

	c.JSON(http.StatusOK, activity)
}

// GET /api/activity/
func GetActivities(c *gin.Context) {
	// ✅ ดึง user_id จาก context (JWT)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userID := userIDInterface.(uint)

	db := config.DB()

	var activities []entity.Activity
	if err := db.Where("user_id = ?", userID).Order("date desc").Find(&activities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch activities"})
		return
	}

	c.JSON(http.StatusOK, activities)
}

// DELETE /api/activity/:id
func DeleteActivity(c *gin.Context) {
	// ดึง user_id จาก context (JWT)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userID := userIDInterface.(uint)

	// ดึง activity ID จาก URL parameter
	activityID := c.Param("id")
	if activityID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Activity ID is required"})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า activity นี้เป็นของ user นี้หรือไม่
	var activity entity.Activity
	if err := db.Where("id = ? AND user_id = ?", activityID, userID).First(&activity).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found or not authorized"})
		return
	}

	// ลบ activity
	if err := db.Delete(&activity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete activity"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Activity deleted successfully"})
}

// PUT /api/activity/:id
func UpdateActivity(c *gin.Context) {
	// ดึง user_id จาก context (JWT)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userID := userIDInterface.(uint)

	// ดึง activity ID จาก URL parameter
	activityID := c.Param("id")
	if activityID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Activity ID is required"})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า activity นี้เป็นของ user นี้หรือไม่
	var existingActivity entity.Activity
	if err := db.Where("id = ? AND user_id = ?", activityID, userID).First(&existingActivity).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found or not authorized"})
		return
	}

	// รับข้อมูลที่ต้องการอัปเดต
	var updateData struct {
		Type     string  `json:"type"`
		Distance float64 `json:"distance"`
		Duration float64 `json:"duration"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// อัปเดตข้อมูล
	existingActivity.Type = updateData.Type
	existingActivity.Distance = updateData.Distance
	existingActivity.Duration = updateData.Duration

	// คำนวณแคลอรี่ใหม่
	MET := 5.0
	switch updateData.Type {
	case "วิ่ง":
		MET = 9.8
	case "เดิน":
		MET = 3.5
	case "ปั่นจักรยาน":
		MET = 7.5
	}

	// หา Health ล่าสุดของ user เพื่อคำนวณแคลอรี่
	var latestHealth entity.Health
	if err := db.Where("user_id = ?", userID).Order("date desc").First(&latestHealth).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No health record found for user"})
		return
	}

	// แปลงนาทีเป็นชั่วโมงสำหรับการคำนวณแคลอรี่
	durationInHours := updateData.Duration / 60.0
	existingActivity.Calories = MET * latestHealth.Weight * durationInHours

	// บันทึกการเปลี่ยนแปลง
	if err := db.Save(&existingActivity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update activity"})
		return
	}

	c.JSON(http.StatusOK, existingActivity)
}
