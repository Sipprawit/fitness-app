package middlewares

import (
	"net/http"
	"strings"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/services"
	"github.com/gin-gonic/gin"
)

// Authorizes ตรวจสอบ JWT และ set user_id ลง context
func Authorizes() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenHeader := c.Request.Header.Get("Authorization")
		if tokenHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header"})
			return
		}

		parts := strings.Split(tokenHeader, "Bearer ")
		if len(parts) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			return
		}

		token := strings.TrimSpace(parts[1])
		jwtWrapper := services.JwtWrapper{
			SecretKey: config.SecretKey,
			Issuer:    "AuthService",
		}

		claims, err := jwtWrapper.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// set user_id และ actor ลง context
		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("actor", claims.Actor)

		c.Next()
	}
}
