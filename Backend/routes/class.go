package routes

import (
	"example.com/fitness-backend/controllers/classactivity"
	classbooking "example.com/fitness-backend/controllers/ClassBooking"
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

	// Class Booking Routes
	api.POST("/class-bookings", classbooking.Create)
	api.DELETE("/class-bookings/:id", classbooking.Cancel)
	api.GET("/class-bookings/user/:user_id/class/:class_id", classbooking.GetUserClassBooking)
	api.GET("/class-bookings/user/:user_id", classbooking.GetUserBookings)
}

// PublicRoutes สำหรับ routes ที่ไม่ต้องใช้ authentication
func PublicClassRoutes(r *gin.Engine) {
	// Public routes ที่ไม่ต้องใช้ authentication
	// (upload route ถูกจัดการใน main.go แล้ว)
}
