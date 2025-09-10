package TrainBooking

import (
	"net/http"
	"strconv"

	"example.com/fitness-backend/entity"
	"example.com/fitness-backend/services"
	"github.com/gin-gonic/gin"
)

// POST /train-bookings
func CreateTrainBooking(c *gin.Context) {
	var trainBooking entity.TrainBooking
	if err := c.ShouldBindJSON(&trainBooking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	newBooking, err := services.CreateTrainBooking(trainBooking)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "เวลานี้ถูกจองแล้ว"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "จองคลาสสำเร็จ",
		"data":    newBooking,
	})
}

// GET /train-bookings/user/:userID
// ฟังก์ชันสำหรับดึงข้อมูลการจองทั้งหมดของสมาชิกคนหนึ่ง
func GetUserBookings(c *gin.Context) {
	userIDStr := c.Param("userID")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผู้ใช้ไม่ถูกต้อง"})
		return
	}

	bookings, err := services.GetBookingsByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลการจองได้"})
		return
	}

	c.JSON(http.StatusOK, bookings)
}

// DELETE /train-bookings/:id
func CancelTrainBooking(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสการจองไม่ถูกต้อง"})
		return
	}

	err = services.CancelTrainBooking(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการจองที่ต้องการยกเลิก"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ยกเลิกการจองสำเร็จ"})
}

