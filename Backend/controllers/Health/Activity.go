package Health

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
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
	activity.Calories = MET * latestHealth.Weight * activity.Duration
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
