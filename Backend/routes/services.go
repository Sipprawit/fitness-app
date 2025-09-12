package routes

import (
	"example.com/fitness-backend/controllers/services"
	"github.com/gin-gonic/gin"
)

func ServicesRoutes(api *gin.RouterGroup) {
	// Service Routes
	api.GET("/services", services.GetAll)
	api.GET("/services/:id", services.Get)
	api.POST("/services", services.Create)
	api.PUT("/services/:id", services.Update)
	api.DELETE("/services/:id", services.Delete)
}
