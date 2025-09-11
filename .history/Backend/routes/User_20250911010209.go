package routes

import (
	"example.com/fitness-backend/controllers/users"
	"github.com/gin-gonic/gin"
)

// UserRoutes - กำหนด routes สำหรับ user profile
func UserRoutes(api *gin.RouterGroup) {
	// User Profile Routes
	api.GET("/user/profile", users.GetProfile)
	api.PUT("/user/profile", users.UpdateProfile)
	api.POST("/user/avatar", users.UploadAvatar)

	// Existing User Management Routes (Admin only)
	api.PUT("/user/:id", users.Update)
	api.GET("/users", users.GetAll)
	api.GET("/user/:id", users.Get)
	api.DELETE("/user/:id", users.Delete)
}
