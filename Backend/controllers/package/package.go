package pkg

import (
	"net/http"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"github.com/gin-gonic/gin"
)

// GetAll ฟังก์ชันสำหรับดึงข้อมูล Package ทั้งหมด
func GetAll(c *gin.Context) {
	var packages []entity.Package
	config.DB().Preload("Service").Preload("DetailService").Find(&packages)
	c.JSON(http.StatusOK, gin.H{"data": packages})
}

// Get ฟังก์ชันสำหรับดึงข้อมูล Package ตาม ID
func Get(c *gin.Context) {
	var pkg entity.Package
	id := c.Param("id")

	if err := config.DB().Preload("Service").Preload("DetailService").Where("id = ?", id).First(&pkg).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Package not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": pkg})
}

// Create ฟังก์ชันสำหรับสร้าง Package ใหม่
func Create(c *gin.Context) {
	var pkg entity.Package
	if err := c.ShouldBindJSON(&pkg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB().Create(&pkg)
	c.JSON(http.StatusOK, gin.H{"data": pkg})
}

// Update ฟังก์ชันสำหรับอัปเดตข้อมูล Package
func Update(c *gin.Context) {
	var pkg entity.Package
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&pkg).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Package not found!"})
		return
	}

	if err := c.ShouldBindJSON(&pkg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB().Save(&pkg)
	c.JSON(http.StatusOK, gin.H{"data": pkg})
}

// Delete ฟังก์ชันสำหรับลบข้อมูล Package
func Delete(c *gin.Context) {
	var pkg entity.Package
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&pkg).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Package not found!"})
		return
	}

	config.DB().Delete(&pkg)
	c.JSON(http.StatusOK, gin.H{"data": "Package deleted successfully"})
}