package routes

import (
	pkg "example.com/fitness-backend/controllers/package"
	"github.com/gin-gonic/gin"
)

func PackageRoutes(api *gin.RouterGroup) {
	// Package Routes
	api.GET("/packages", pkg.GetAll)
	api.GET("/packages/:id", pkg.Get)
	api.POST("/packages", pkg.Create)
	api.PUT("/packages/:id", pkg.Update)
	api.DELETE("/packages/:id", pkg.Delete)
}
