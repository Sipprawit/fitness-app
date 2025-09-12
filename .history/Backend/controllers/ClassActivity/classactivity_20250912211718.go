package classactivity

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
)

func GetAll(c *gin.Context) {
	var items []entity.ClassActivity
	db := config.DB()
	result := db.Preload("Reviews.User").Find(&items)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	// คำนวณจำนวนผู้เข้าร่วมปัจจุบันจากการจองที่ยังไม่ถูกยกเลิก
	for i := range items {
		var count int64
		db.Model(&entity.ClassBooking{}).
			Where("class_activity_id = ? AND status <> ?", items[i].ID, "Cancelled").
			Count(&count)
		items[i].CurrentParticipants = int(count)
	}
	c.JSON(http.StatusOK, items)
}

func Get(c *gin.Context) {
	id := c.Param("id")
	var item entity.ClassActivity
	db := config.DB()
	result := db.Preload("Reviews.User").First(&item, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	// คำนวณจำนวนผู้เข้าร่วมปัจจุบันจากการจองที่ยังไม่ถูกยกเลิก
	var count int64
	db.Model(&entity.ClassBooking{}).
		Where("class_activity_id = ? AND status <> ?", item.ID, "Cancelled").
		Count(&count)
	item.CurrentParticipants = int(count)
	c.JSON(http.StatusOK, item)
}

// แก้ไขฟังก์ชัน Create ให้รองรับการอัปโหลดไฟล์และข้อมูล JSON
func Create(c *gin.Context) {
	var payload entity.ClassActivity
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad payload"})
		return
	}

	// เพิ่มโค้ดสำหรับอัปโหลดไฟล์
	if imageFile, err := c.FormFile("image"); err == nil {
		fileName := filepath.Base(imageFile.Filename)
		dst := filepath.Join("./uploads/class", fileName)
		if err := c.SaveUploadedFile(imageFile, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
		payload.ImageURL = fmt.Sprintf("/uploads/class/%s", fileName)
	}

	db := config.DB()
	if err := db.Create(&payload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, payload)
}

// แก้ไขฟังก์ชัน Update ให้รองรับการอัปโหลดไฟล์และข้อมูล JSON
func Update(c *gin.Context) {
	id := c.Param("id")
	var existing entity.ClassActivity
	db := config.DB()
	if err := db.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBind(&existing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad payload"})
		return
	}

	if imageFile, err := c.FormFile("image"); err == nil {
		fileName := filepath.Base(imageFile.Filename)
		dst := filepath.Join("./uploads/class", fileName)
		if err := c.SaveUploadedFile(imageFile, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
		existing.ImageURL = fmt.Sprintf("/uploads/class/%s", fileName)
	}

	if err := db.Save(&existing).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, existing)
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Delete(&entity.ClassActivity{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.Status(http.StatusNoContent)
}

// ฟังก์ชัน UploadImage ที่ถูกต้อง
func UploadImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get image file"})
		return
	}

	fileName := filepath.Base(file.Filename)
	dst := filepath.Join("./uploads/class", fileName)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	imageUrl := fmt.Sprintf("/uploads/class/%s", fileName)
	c.JSON(http.StatusOK, gin.H{"imageUrl": imageUrl})
}

// GetClassReviews: ดึงรีวิวของคลาส
func GetClassReviews(c *gin.Context) {
	classID := c.Param("id")
	var reviews []entity.Review
	db := config.DB()

	// ดึงรีวิวที่เกี่ยวข้องกับคลาสนี้
	result := db.Where("reviewable_id = ? AND reviewable_type = ?", classID, "classes").
		Preload("User").
		Find(&reviews)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, reviews)
}
