package review

import (
	"net/http"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// --- Helper Function ---
func updateClassRating(classID uint) {
	db := config.DB()
	var reviews []entity.Review
	var totalRating float64 = 0
	db.Where("reviewable_id = ? AND reviewable_type = ?", classID, "classes").Find(&reviews)

	// คำนวณคะแนนเฉลี่ย
	var averageRating float64 = 0
	if len(reviews) > 0 {
		for _, r := range reviews {
			totalRating += float64(r.Rating)
		}
		averageRating = totalRating / float64(len(reviews))
	}

	// อัปเดตคะแนนเฉลี่ยและจำนวนรีวิวในตาราง ClassActivity
	db.Model(&entity.ClassActivity{}).Where("id = ?", classID).Updates(map[string]interface{}{
		"average_rating": averageRating,
		"review_count":   uint(len(reviews)),
	})
}

func updateTrainerRating(trainerID uint) {
	db := config.DB()
	var reviews []entity.Review
	var totalRating float64 = 0
	db.Where("reviewable_id = ? AND reviewable_type = ?", trainerID, "trainers").Find(&reviews)

	// คำนวณคะแนนเฉลี่ย
	var averageRating float64 = 0
	if len(reviews) > 0 {
		for _, r := range reviews {
			totalRating += float64(r.Rating)
		}
		averageRating = totalRating / float64(len(reviews))
	}

	// อัปเดตคะแนนเฉลี่ยและจำนวนรีวิวในตาราง Trainer
	db.Model(&entity.Trainer{}).Where("id = ?", trainerID).Updates(map[string]interface{}{
		"average_rating": averageRating,
		"review_count":   uint(len(reviews)),
	})
}

// --- Controller Functions ---

// CreateReview: สร้างรีวิวใหม่
func CreateReview(c *gin.Context) {
	// รองรับ payload แบบ camelCase จาก frontend
	type createReviewPayload struct {
		Rating         int    `json:"rating"`
		Comment        string `json:"comment"`
		ReviewableID   uint   `json:"reviewableID"`
		ReviewableType string `json:"reviewableType"`
	}

	var payload createReviewPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ดึง userId ที่ Middleware ส่งมาให้ผ่าน c.Get()
	userIdFromToken, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Map payload -> entity
	review := entity.Review{
		Rating:         payload.Rating,
		Comment:        payload.Comment,
		ReviewableID:   payload.ReviewableID,
		ReviewableType: payload.ReviewableType,
		UserID:         userIdFromToken.(uint),
	}

	db := config.DB()
	if err := db.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review: " + err.Error()})
		return
	}

	if review.ReviewableType == "classes" {
		updateClassRating(review.ReviewableID)
	} else if review.ReviewableType == "trainers" {
		updateTrainerRating(review.ReviewableID)
	}

	// Preload ข้อมูล User เพื่อส่งกลับไปให้ Frontend แสดงผลทันที
	db.Preload("User").First(&review, review.ID)

	c.JSON(http.StatusCreated, review)
}

// UpdateReview: แก้ไขรีวิว
func UpdateReview(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var review entity.Review
	if err := db.First(&review, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	var updatedData entity.Review
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Model(&review).Updates(updatedData)
	if review.ReviewableType == "classes" {
		updateClassRating(review.ReviewableID)
	} else if review.ReviewableType == "trainers" {
		updateTrainerRating(review.ReviewableID)
	}
	c.JSON(http.StatusOK, review)
}

// DeleteReview: ลบรีวิว
func DeleteReview(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var review entity.Review
	if err := db.First(&review, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}
	reviewableID := review.ReviewableID
	reviewableType := review.ReviewableType
	db.Delete(&review)
	if reviewableType == "classes" {
		updateClassRating(reviewableID)
	} else if reviewableType == "trainers" {
		updateTrainerRating(reviewableID)
	}
	c.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}
