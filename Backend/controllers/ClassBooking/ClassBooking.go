package ClassBooking

import (
	"net/http"
	"strconv"

	"example.com/fitness-backend/entity"
	"example.com/fitness-backend/services"
	"github.com/gin-gonic/gin"
)

// POST /class-bookings
func Create(c *gin.Context) {
	var req entity.ClassBooking
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	booking, err := services.CreateClassBooking(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, booking)
}

// DELETE /class-bookings/:id
func Cancel(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสการจองไม่ถูกต้อง"})
		return
	}

	booking, err := services.CancelClassBooking(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการจองที่ต้องการยกเลิก"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// GET /class-bookings/user/:user_id/class/:class_id
func GetUserClassBooking(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผู้ใช้ไม่ถูกต้อง"})
		return
	}

	classID, err := strconv.Atoi(c.Param("class_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสคลาสไม่ถูกต้อง"})
		return
	}

	booking, err := services.GetUserClassBooking(uint(userID), uint(classID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการจอง"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// GET /class-bookings/user/:user_id
func GetUserBookings(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผู้ใช้ไม่ถูกต้อง"})
		return
	}

	bookings, err := services.GetUserBookings(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลการจองได้"})
		return
	}

	c.JSON(http.StatusOK, bookings)
}


