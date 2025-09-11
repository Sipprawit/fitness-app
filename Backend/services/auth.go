package services

import (
	"errors"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
	SecretKey       string
	Issuer          string
	ExpirationHours int64
}

// JwtClaim adds user info as a claim to the token
type JwtClaim struct {
	UserID uint   `json:"user_id"` // ✅ เพิ่ม user_id
	Email  string `json:"email"`
	Actor  string `json:"actor"`   // ✅ เพิ่ม actor (role, เช่น renter/host/admin)
	jwt.StandardClaims
}

// GenerateAccessToken อายุสั้น (15 นาที)
func (j *JwtWrapper) GenerateAccessToken(userID uint, email string, actor string) (string, error) {
	claims := &JwtClaim{
		UserID: userID,
		Email:  email,
		Actor:  actor,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 15).Unix(),
			Issuer:    j.Issuer,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.SecretKey))
}

// GenerateRefreshToken อายุยาว (7 วัน)
func (j *JwtWrapper) GenerateRefreshToken(userID uint, email string, actor string) (string, error) {
	claims := &JwtClaim{
		UserID: userID,
		Email:  email,
		Actor:  actor,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
			Issuer:    j.Issuer,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.SecretKey))
}

// ValidateToken ตรวจสอบ JWT token
func (j *JwtWrapper) ValidateToken(signedToken string) (*JwtClaim, error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JwtClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JwtClaim)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
