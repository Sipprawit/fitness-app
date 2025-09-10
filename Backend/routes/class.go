package routes

import (
	"example.com/fitness-backend/controllers/classactivity"
	"github.com/gin-gonic/gin"
)

func ClassRoutes(api *gin.RouterGroup) {
	// Class Activity Routes
	api.GET("/classes", classactivity.GetAll)
	api.GET("/classes/:id", classactivity.Get)
	api.POST("/classes", classactivity.Create)
	api.PUT("/classes/:id", classactivity.Update)
	api.DELETE("/classes/:id", classactivity.Delete)
	api.POST("/upload-image", classactivity.UploadImage) // Route for image upload
}

// PublicRoutes สำหรับ routes ที่ไม่ต้องใช้ authentication
func PublicClassRoutes(r *gin.Engine) {
	// Public upload route for images
	r.POST("/upload", classactivity.UploadImage)
}
