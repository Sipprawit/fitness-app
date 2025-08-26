package middlewares

import (
	"net/http"
	"strings"
	"example.com/fitness-backend/config" // Import config package
	"example.com/fitness-backend/services"
	"github.com/gin-gonic/gin"
)

// Authorizes เป็นฟังก์ชั่นตรวจเช็ค Header
func Authorizes() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.Request.Header.Get("Authorization")
		if clientToken == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
			return
		}

		// ตรวจสอบรูปแบบของ Token (Bearer token)
		extractedToken := strings.Split(clientToken, "Bearer ")
		if len(extractedToken) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
			return
		}
		
		token := strings.TrimSpace(extractedToken[1])

		jwtWrapper := services.JwtWrapper{
			SecretKey: config.SecretKey, // ใช้ SecretKey จาก config
			Issuer:    "AuthService",
		}

		_, err := jwtWrapper.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		c.Next()
	}
}
