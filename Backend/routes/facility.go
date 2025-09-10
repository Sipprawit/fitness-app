package routes

import (
	"github.com/gin-gonic/gin"
	"example.com/fitness-backend/controllers/facility"
)

func FacilityRoutes(api *gin.RouterGroup) {
	// Facility Routes
	api.GET("/facilities", facility.GetAll)
	api.GET("/facilities/:id", facility.Get)
	api.POST("/facilities", facility.Create)
	api.PUT("/facilities/:id", facility.Update)
	api.DELETE("/facilities/:id", facility.Delete)
}
