package config

import (
	"time"
	"github.com/golang-jwt/jwt"
)

// claims เป็นโครงสร้างสำหรับข้อมูลใน JWT token
type claims struct {
	UserID uint   `json:"userId"`
	Email  string `json:"email"`
	jwt.StandardClaims
}

// GenerateToken สร้าง JWT token ใหม่สำหรับผู้ใช้ที่กำหนด
func GenerateToken(userID uint, email string, expirationTime time.Time) (string, error) {
	claims := &claims{
		UserID: userID,
		Email:  email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// ✅ ใช้ SecretKey จาก ConnectionDB.go
	tokenString, err := token.SignedString([]byte(SecretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
