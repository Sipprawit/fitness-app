package services

import (
	"net/http"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"github.com/gin-gonic/gin"
)

// GetAll ฟังก์ชันสำหรับดึงข้อมูล Services ทั้งหมด
func GetAll(c *gin.Context) {
	var services []entity.Services
	config.DB().Find(&services)
	c.JSON(http.StatusOK, gin.H{"data": services})
}

// Get ฟังก์ชันสำหรับดึงข้อมูล Services ตาม ID
func Get(c *gin.Context) {
	var service entity.Services
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&service).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Service not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": service})
}

// Create ฟังก์ชันสำหรับสร้าง Services ใหม่
func Create(c *gin.Context) {
	var service entity.Services
	if err := c.ShouldBindJSON(&service); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB().Create(&service)
	c.JSON(http.StatusOK, gin.H{"data": service})
}

// Update ฟังก์ชันสำหรับอัปเดตข้อมูล Services
func Update(c *gin.Context) {
	var service entity.Services
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&service).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Service not found!"})
		return
	}

	if err := c.ShouldBindJSON(&service); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB().Save(&service)
	c.JSON(http.StatusOK, gin.H{"data": service})
}

// Delete ฟังก์ชันสำหรับลบข้อมูล Services
func Delete(c *gin.Context) {
	var service entity.Services
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&service).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Service not found!"})
		return
	}

	config.DB().Delete(&service)
	c.JSON(http.StatusOK, gin.H{"data": "Service deleted successfully"})
}


