package config

import (
	"time"
	"github.com/golang-jwt/jwt"
)

type claims struct {
	UserID uint   `json:"user_id"`
	Email string `json:"email"`
	Actor string `json:"actor"` // <-- เพิ่ม Actor
	jwt.StandardClaims
}

func GenerateToken(id uint, email string, actor string, expirationTime time.Time) (string, error) { // <-- เพิ่ม actor
	claims := &claims{
		UserID: id,
		Email: email,
		Actor: actor, // <-- เพิ่ม Actor
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(SecretKey))
}
