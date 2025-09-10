package Trainer

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"
	"strings"

	"example.com/fitness-backend/entity"
	"example.com/fitness-backend/services"

	"github.com/gin-gonic/gin"
)

// POST /trainers
func CreateTrainer(c *gin.Context) {
	var trainer entity.Trainer
	if err := c.ShouldBindJSON(&trainer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	newTrainer, err := services.CreateTrainer(trainer)
	if err != nil {
		// จัดการกรณีอีเมลซ้ำ ให้ส่ง 409 แทน 500
		errMsg := err.Error()
		lower := strings.ToLower(errMsg)
		if strings.Contains(lower, "password required") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุรหัสผ่าน"})
			return
		}
		if strings.Contains(lower, "email already exists") ||
			strings.Contains(lower, "unique") && strings.Contains(lower, "email") {
			c.JSON(http.StatusConflict, gin.H{"error": "อีเมลนี้ถูกใช้งานแล้ว"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": errMsg})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "เพิ่มข้อมูลเทรนเนอร์สำเร็จ",
		"data":    newTrainer,
	})
}

// GET /trainers
func GetTrainers(c *gin.Context) {
	trainers, err := services.GetTrainers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, trainers)
}

// GET /trainers/:id
func GetTrainerByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	trainer, err := services.GetTrainerByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trainer not found"})
		return
	}
	c.JSON(http.StatusOK, trainer)
}

// PUT /trainers/:id
func UpdateTrainer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var trainer entity.Trainer
	if err := c.ShouldBindJSON(&trainer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	updated, err := services.UpdateTrainer(uint(id), trainer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

// DELETE /trainers/:id
func DeleteTrainer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	err := services.DeleteTrainer(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Trainer deleted successfully"})
}


func UploadFile(c *gin.Context) {
	// รับไฟล์จาก form-data โดยใช้ key ว่า "file"
	// ✅ แก้ไขให้ key เป็น "file" เพื่อให้ตรงกับโค้ดใน Frontend
	file, err := c.FormFile("file") 
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกไฟล์"})
		return
	}

	// สร้างชื่อไฟล์ใหม่ ป้องกันชื่อซ้ำ
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	savePath := filepath.Join("uploads", "trainers", filename) 

	// บันทึกไฟล์ลงในโฟลเดอร์ของเซิร์ฟเวอร์
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกไฟล์ได้"})
		return
	}

	// ส่ง URL ของไฟล์กลับไปให้ Frontend
	fileURL := fmt.Sprintf("/uploads/trainers/%s", filename)

	c.JSON(http.StatusOK, gin.H{
		"message": "อัปโหลดไฟล์สำเร็จ",
		"url":     fileURL, // ✅ ส่ง URL กลับไป
	})
}