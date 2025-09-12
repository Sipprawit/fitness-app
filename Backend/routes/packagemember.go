package routes

import (
	"example.com/fitness-backend/controllers/packagemember"
	"github.com/gin-gonic/gin"
)

func PackagememberRoutes(api *gin.RouterGroup) {
	// Package Member Routes
	api.GET("/package-members/user/:user_id", packagemember.GetByUserID)
	api.POST("/package-members", packagemember.Create)
	api.PUT("/package-members/user/:user_id", packagemember.UpdateByUserID)
	api.DELETE("/package-members/user/:user_id", packagemember.DeleteByUserID)
}
