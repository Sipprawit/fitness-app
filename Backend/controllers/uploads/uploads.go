package uploads

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// Upload handles POST /upload with form-data key "file"
func Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกไฟล์"})
		return
	}

	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	dirPath := filepath.Join("uploads", "trainers")
	savePath := filepath.Join(dirPath, filename)

	if err := os.MkdirAll(dirPath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างโฟลเดอร์จัดเก็บไฟล์ได้"})
		return
	}

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกไฟล์ได้"})
		return
	}

	fileURL := fmt.Sprintf("/uploads/trainers/%s", filename)
	c.JSON(http.StatusOK, gin.H{
		"message": "อัปโหลดไฟล์สำเร็จ",
		"url":     fileURL,
	})
}
