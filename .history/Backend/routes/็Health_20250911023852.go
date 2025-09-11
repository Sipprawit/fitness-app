package routes

import (
	healthController "example.com/fitness-backend/controllers/Health"
	"example.com/fitness-backend/middlewares"
	"github.com/gin-gonic/gin"
)

func HealthRoutes(r *gin.RouterGroup) {
	health := r.Group("/health")
	health.Use(middlewares.Authorizes())
	{
		health.POST("", healthController.CreateHealth)
		health.GET("", healthController.GetAllHealth)
	}

	activity := r.Group("/activity")
	activity.Use(middlewares.Authorizes()) // ✅ ต้องใช้ Authorizes ด้วย
	{
		activity.POST("", healthController.CreateActivity)
		activity.GET("", healthController.GetActivities)         // ✅ เพิ่ม GET
		activity.DELETE("/:id", healthController.DeleteActivity) // ✅ เพิ่ม DELETE
	}

	// Nutrition routes
	nutrition := r.Group("/nutrition")
	nutrition.Use(middlewares.Authorizes())
	{
		nutrition.POST("", healthController.CreateOrUpdateNutrition)
		nutrition.GET("", healthController.GetNutrition)
	}
}
