package routes

import (
	"github.com/gin-gonic/gin"
	"example.com/fitness-backend/controllers/equipment"
)

func EquipmentRoutes(api *gin.RouterGroup) {
	// Equipment Routes
	api.GET("/equipments", equipment.GetAll)
	api.GET("/equipments/:id", equipment.Get)
	api.POST("/equipments", equipment.Create)
	api.PUT("/equipments/:id", equipment.Update)
	api.DELETE("/equipments/:id", equipment.Delete)
}
