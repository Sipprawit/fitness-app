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

// GET /train-bookings/customers
// ฟังก์ชันสำหรับดึงข้อมูลลูกค้าที่จองเทรนเนอร์บัญชีที่ล็อกอินอยู่
func GetCustomersByTrainerID(c *gin.Context) {
	// ดึงข้อมูลจาก context ที่ middleware ตั้งค่าไว้
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบข้อมูลผู้ใช้"})
		return
	}

	actor, exists := c.Get("actor")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบข้อมูล actor"})
		return
	}

	// ตรวจสอบว่าเป็นเทรนเนอร์หรือไม่
	if actor != "trainer" {
		c.JSON(http.StatusForbidden, gin.H{"error": "เฉพาะเทรนเนอร์เท่านั้นที่สามารถเข้าถึงได้"})
		return
	}

	// ใช้ user_id ของเทรนเนอร์ที่ล็อกอินอยู่
	trainerID := userID.(uint)

	customers, err := services.GetCustomersByTrainerID(trainerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลลูกค้าได้"})
		return
	}
	c.JSON(http.StatusOK, customers)
}

// GetCustomerBookedTimes ดึงข้อมูลเวลาที่ลูกค้าจองไว้
func GetCustomerBookedTimes(c *gin.Context) {
	customerIDStr := c.Param("customerID")
	customerID, err := strconv.Atoi(customerIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสลูกค้าไม่ถูกต้อง"})
		return
	}

	bookings, err := services.GetCustomerBookedTimes(uint(customerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลเวลาที่จองได้"})
		return
	}
	c.JSON(http.StatusOK, bookings)
}
