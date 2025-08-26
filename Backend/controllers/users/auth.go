package users

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
)

// Payload เป็นโครงสร้างข้อมูลสำหรับรับ input จากการสมัครสมาชิก
type Payload struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Age       uint8    `json:"age"`
	BirthDay  string `json:"birthDay"` // ต้องเป็น string เพื่อรับค่าจาก frontend
	GenderID  uint   `json:"genderId"`
}

// SignInBody Struct เพื่อรับข้อมูลจาก Request Body
type SignInBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// SignInResponse Struct เพื่อส่งข้อมูล Response กลับไปให้ Frontend
type SignInResponse struct {
	Status    int         `json:"status"`
	TokenType string      `json:"token_type"`
	Token     string      `json:"token"`
	ID        uint        `json:"id"`
	Actor     string      `json:"actor"`
	Data      interface{} `json:"data"`
	Error     string      `json:"error"`
}

// SignUp handles user registration
func SignUp(c *gin.Context) {
	var payload Payload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the password
	hashedPassword, err := config.HashPassword(payload.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// สร้างข้อมูลผู้ใช้ใหม่
	user := entity.Users{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  hashedPassword,
		Age:       payload.Age,
		BirthDay:  payload.BirthDay,
		GenderID:  payload.GenderID,
		Actor:     "customer", // กำหนดบทบาทเริ่มต้นเป็น 'customer'
	}

	// บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
	if result := config.DB().Create(&user); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "User created successfully"})
}

// SignIn handles user authentication
func SignIn(c *gin.Context) {
	var body SignInBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, SignInResponse{Error: "Invalid request body."})
		return
	}

	var user entity.Users
	if tx := config.DB().Where("email = ?", body.Email).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, SignInResponse{Error: "User not found."})
		return
	}

	// ตรวจสอบรหัสผ่าน
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, SignInResponse{Error: "Invalid credentials."})
		return
	}

	// สร้าง JWT Token
	token, err := config.GenerateToken(user.ID, user.Email, time.Now().Add(24*time.Hour))
	if err != nil {
		c.JSON(http.StatusInternalServerError, SignInResponse{Error: "Failed to generate token."})
		return
	}

	// ส่ง Response กลับไปพร้อมกับ Actor ที่ถูกต้อง
	c.JSON(http.StatusOK, SignInResponse{
		Status:    http.StatusOK,
		TokenType: "Bearer",
		Token:     token,
		ID:        user.ID,
		Actor:     user.Actor,
		Data:      user,
	})
}