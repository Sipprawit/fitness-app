package routes

import (
	"example.com/fitness-backend/controllers/review"
	"github.com/gin-gonic/gin"
)

func ReviewRoutes(r *gin.RouterGroup) {
	// --- Review Routes ---
	r.POST("/reviews", review.CreateReview)

	r.GET("/reviews", review.GetReviews)
	r.PUT("/reviews/:id", review.UpdateReview)
	r.DELETE("/reviews/:id", review.DeleteReview)
}
