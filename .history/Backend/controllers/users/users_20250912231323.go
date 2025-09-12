package users

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"example.com/fitness-backend/config"

	"example.com/fitness-backend/entity"
)

func GetAll(c *gin.Context) {
	var users []entity.Users
	db := config.DB()
	results := db.Preload("Gender").Find(&users)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func Get(c *gin.Context) {
	ID := c.Param("id")
	var user entity.Users
	db := config.DB()
	results := db.Preload("Gender").First(&user, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if user.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, user)
}

func Update(c *gin.Context) {
	var user entity.Users
	UserID := c.Param("id")
	db := config.DB()
	result := db.First(&user, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// GetProfile - ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ login
func GetProfile(c *gin.Context) {
	// ดึง user ID จาก JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user entity.Users
	db := config.DB()

	// ดึงข้อมูลผู้ใช้พร้อม Gender
	result := db.Preload("Gender").First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// สร้าง response ที่มี username (ใช้ email แทน)
	response := gin.H{
		"id":         user.ID,
		"username":   user.Email, // ใช้ email เป็น username
		"email":      user.Email,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"avatar":     user.Avatar, // ดึง avatar URL จากฐานข้อมูล
		"created_at": user.CreatedAt,
		"gender":     user.Gender,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// UpdateProfile - อัปเดตข้อมูลโปรไฟล์ของผู้ใช้
func UpdateProfile(c *gin.Context) {
	// ดึง user ID จาก JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user entity.Users
	db := config.DB()

	// หาผู้ใช้
	result := db.First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// รับข้อมูลที่ต้องการอัปเดต
	var updateData struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// อัปเดตข้อมูล
	if updateData.FirstName != "" {
		user.FirstName = updateData.FirstName
	}
	if updateData.LastName != "" {
		user.LastName = updateData.LastName
	}
	if updateData.Email != "" {
		user.Email = updateData.Email
	}

	// บันทึกการเปลี่ยนแปลง
	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	// สร้าง response
	response := gin.H{
		"id":         user.ID,
		"username":   user.Email,
		"email":      user.Email,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"avatar":     user.Avatar,
		"created_at": user.CreatedAt,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// UploadAvatar - อัปโหลดรูปโปรไฟล์
func UploadAvatar(c *gin.Context) {
	// ดึง user ID จาก JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// รับไฟล์
	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// ตรวจสอบประเภทไฟล์
	if file.Header.Get("Content-Type")[:5] != "image" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only image files are allowed"})
		return
	}

	// ตรวจสอบขนาดไฟล์ (5MB)
	if file.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size must be less than 5MB"})
		return
	}

	// สร้างชื่อไฟล์ใหม่
	fileName := "avatar_" + strconv.Itoa(int(userID.(uint))) + "_" + file.Filename

	// บันทึกไฟล์
	if err := c.SaveUploadedFile(file, "uploads/avatars/"+fileName); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// สร้าง URL สำหรับเข้าถึงไฟล์
	avatarURL := "http://localhost:8000/uploads/avatars/" + fileName

	// บันทึก avatar URL ลงฐานข้อมูล
	var user entity.Users
	db := config.DB()
	result := db.First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Avatar = avatarURL
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save avatar URL"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Avatar uploaded successfully",
		"avatar_url": avatarURL,
	})
}

// DeleteAvatar - ลบรูปโปรไฟล์
func DeleteAvatar(c *gin.Context) {
	// ดึง user ID จาก JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - user_id not found in context"})
		return
	}

	// Debug: แสดง user ID
	fmt.Printf("DeleteAvatar - User ID: %v\n", userID)

	// หาข้อมูล user
	var user entity.Users
	db := config.DB()
	result := db.First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Debug: แสดงข้อมูล user
	fmt.Printf("DeleteAvatar - User found: ID=%d, Avatar=%s\n", user.ID, user.Avatar)

	// ลบ avatar URL จากฐานข้อมูล
	user.Avatar = ""
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete avatar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Avatar deleted successfully",
	})
}
