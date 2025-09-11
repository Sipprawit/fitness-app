package users

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

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

// GetUserProfile gets the current user's profile
func GetUserProfile(c *gin.Context) {
	// Get user ID from JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user entity.Users
	db := config.DB()
	result := db.Preload("Gender").First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"phone":      user.Phone,
			"avatar":     user.Avatar,
			"created_at": user.CreatedAt,
		},
	})
}

// UpdateUserProfile updates the current user's profile
func UpdateUserProfile(c *gin.Context) {
	// Get user ID from JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var updateData struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Phone     string `json:"phone"`
		Email     string `json:"email"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var user entity.Users
	db := config.DB()
	result := db.First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update fields
	if updateData.FirstName != "" {
		user.FirstName = updateData.FirstName
	}
	if updateData.LastName != "" {
		user.LastName = updateData.LastName
	}
	if updateData.Phone != "" {
		user.Phone = updateData.Phone
	}
	if updateData.Email != "" {
		user.Email = updateData.Email
	}

	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"phone":      user.Phone,
			"avatar":     user.Avatar,
			"created_at": user.CreatedAt,
		},
	})
}

// UploadAvatar handles avatar upload
func UploadAvatar(c *gin.Context) {
	// Get user ID from JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get the uploaded file
	file, header, err := c.Request.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	// Validate file type
	if !isValidImageType(header) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only images are allowed"})
		return
	}

	// Validate file size (max 5MB)
	if header.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size too large. Maximum 5MB allowed"})
		return
	}

	// Create uploads directory if it doesn't exist
	uploadDir := "uploads/avatars"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Generate unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("avatar_%d_%d%s", userID, time.Now().Unix(), ext)
	filepath := filepath.Join(uploadDir, filename)

	// Save file
	out, err := os.Create(filepath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Update user avatar in database
	var user entity.Users
	db := config.DB()
	result := db.First(&user, userID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Delete old avatar if exists
	if user.Avatar != "" {
		oldPath := strings.TrimPrefix(user.Avatar, "/")
		os.Remove(oldPath)
	}

	// Update avatar path
	avatarURL := "/" + filepath
	user.Avatar = avatarURL
	db.Save(&user)

	c.JSON(http.StatusOK, gin.H{
		"message":    "Avatar uploaded successfully",
		"avatar_url": avatarURL,
	})
}

// isValidImageType checks if the uploaded file is a valid image
func isValidImageType(header *multipart.FileHeader) bool {
	allowedTypes := []string{"image/jpeg", "image/jpg", "image/png", "image/gif"}
	contentType := header.Header.Get("Content-Type")

	for _, allowedType := range allowedTypes {
		if contentType == allowedType {
			return true
		}
	}
	return false
}
