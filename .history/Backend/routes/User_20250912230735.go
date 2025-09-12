package routes

import (
	"example.com/fitness-backend/controllers/users"
	"github.com/gin-gonic/gin"
)

// UserProfileRoutes - กำหนด routes สำหรับ user profile เท่านั้น
func UserProfileRoutes(api *gin.RouterGroup) {
	// User Profile Routes
	api.GET("/user/profile", users.GetProfile)
	api.PUT("/user/profile", users.UpdateProfile)
	api.POST("/user/avatar", users.UploadAvatar)
	api.DELETE("/user/avatar", users.DeleteAvatar)
}
