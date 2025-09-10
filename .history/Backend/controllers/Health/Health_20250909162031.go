package health

import (
	"log"
	"net/http"
	"time"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"github.com/gin-gonic/gin"
)

// CreateHealth - POST /api/health/
func CreateHealth(c *gin.Context) {
	var health entity.Health

	if err := c.ShouldBindJSON(&health); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}

	userID, ok := userIDRaw.(uint)
	if !ok || userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
		return
	}

	health.UserID = userID

	if health.Date == "" {
		health.Date = time.Now().Format("2006-01-02")
	}

	log.Printf("Creating Health record: %+v\n", health)

	db := config.DB()
	if err := db.Create(&health).Error; err != nil {
		log.Printf("Failed to create health: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"id":      health.ID,
		"data":    health,
	})
}

// GetAllHealth - GET /api/health/:user_id
func GetAllHealth(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found in context"})
		return
	}
	userID := userIDVal.(uint)

	var healths []entity.Health
	if err := config.DB().Where("user_id = ?", userID).Order("date desc").Find(&healths).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, healths)
}
