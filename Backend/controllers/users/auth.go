package users

import (
	"net/http"
	"time"
	"golang.org/x/crypto/bcrypt"
	"github.com/gin-gonic/gin"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
)

type Payload struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Age       uint8  `json:"age"`
	BirthDay  string `json:"birthday"`
	GenderID  uint   `json:"gender_id"`
}

type SignInBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignInResponse struct {
	Status    int         `json:"status"`
	TokenType string      `json:"token_type"`
	Token     string      `json:"token"`
	ID        uint        `json:"id"`
	Actor     string      `json:"actor"`
	Data      interface{} `json:"data"`
	Error     string      `json:"error"`
}

// SignUp
// SignUp (จะกลายเป็น SignUpCustomer)
func SignUp(c *gin.Context) {
	var payload Payload // ใช้ Payload เดิมได้
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := config.HashPassword(payload.Password)
	if err != nil {
		// ... handle error
		return
	}

	// สร้าง Customer เท่านั้น
	customer := entity.Users{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  hashedPassword,
		Age:       payload.Age,
		BirthDay:  payload.BirthDay,
		GenderID:  payload.GenderID,
	}

	if result := config.DB().Create(&customer); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"}) // เปลี่ยนเป็น 201 Created
}


// SignIn (ปรับปรุง Logic ทั้งหมด)
func SignIn(c *gin.Context) {
	var body SignInBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, SignInResponse{Error: "Invalid request body."})
		return
	}

	var token string
	var actor string
	var id uint
	var data interface{}
	var err error

	// 1. ลองหาในตาราง Customer
	var customer entity.Users
	if tx := config.DB().Where("email = ?", body.Email).First(&customer); tx.RowsAffected > 0 {
		if bcrypt.CompareHashAndPassword([]byte(customer.Password), []byte(body.Password)) == nil {
			token, err = config.GenerateToken(customer.ID, customer.Email, "customer", time.Now().Add(24*time.Hour))
			if err != nil {
				c.JSON(http.StatusInternalServerError, SignInResponse{Error: "Failed to generate token."})
				return
			}
			actor = "customer"
			id = customer.ID
			data = customer
		}
	}

	// 2. ถ้าไม่เจอใน Customer หรือรหัสผ่านผิด, ลองหาในตาราง Trainer
	if actor == "" {
		var trainer entity.Trainer
		if tx := config.DB().Where("email = ?", body.Email).First(&trainer); tx.RowsAffected > 0 {
			if bcrypt.CompareHashAndPassword([]byte(trainer.Password), []byte(body.Password)) == nil {
				token, err = config.GenerateToken(trainer.ID, trainer.Email, "trainer", time.Now().Add(24*time.Hour))
				if err != nil {
					c.JSON(http.StatusInternalServerError, SignInResponse{Error: "Failed to generate token."})
					return
				}
				actor = "trainer"
				id = trainer.ID
				data = trainer
			}
		}
	}

	// 3. ถ้ายังไม่เจอ, ลองหาในตาราง Admin
	if actor == "" {
		var admin entity.Admin
		if tx := config.DB().Where("email = ?", body.Email).First(&admin); tx.RowsAffected > 0 {
			if bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(body.Password)) == nil {
				token, err = config.GenerateToken(admin.ID, admin.Email, "admin", time.Now().Add(24*time.Hour))
				if err != nil {
					c.JSON(http.StatusInternalServerError, SignInResponse{Error: "Failed to generate token."})
					return
				}
				actor = "admin"
				id = admin.ID
				data = admin
			}
		}
	}

	// 4. สรุปผล
	if actor == "" {
		c.JSON(http.StatusUnauthorized, SignInResponse{Error: "Invalid credentials."})
		return
	}

	c.JSON(http.StatusOK, SignInResponse{
		Status:    http.StatusOK,
		TokenType: "Bearer",
		Token:     token,
		ID:        id,
		Actor:     actor,
		Data:      data,
	})
}
