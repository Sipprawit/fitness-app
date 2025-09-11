package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/fitness-backend/config"

	"example.com/fitness-backend/controllers/genders"

	"example.com/fitness-backend/controllers/uploads"
	"example.com/fitness-backend/controllers/users"

	"example.com/fitness-backend/middlewares"

	"time"

	"example.com/fitness-backend/routes"
	"github.com/gin-contrib/cors"
)

const PORT = "8000"

func main() {

	// open connection database

	config.ConnectionDB()

	// Generate databases

	config.SetupDatabase()

	r := gin.Default()

	// เปิด CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ให้บริการไฟล์อัปโหลดแบบสาธารณะ
	r.Static("/uploads", "uploads")

	// Auth Routes
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)

	// Public upload route for images
	r.POST("/upload", uploads.Upload)

	// API Group
	api := r.Group("/api")
	{
		api.Use(middlewares.Authorizes())

		// User Profile Routes
		routes.UserProfileRoutes(api)
		
		// User Management Routes (Admin)
		api.PUT("/user/:id", users.Update)
		api.GET("/users", users.GetAll)
		api.GET("/user/:id", users.Get)
		api.DELETE("/user/:id", users.Delete)

		// Health & Activity Routes
		routes.HealthRoutes(api)

		// Trainer-related Routes
		routes.TrainerRoutes(api)
	}

	r.GET("/genders", genders.GetAll)

	r.GET("/", func(c *gin.Context) {

		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)

	})

	// Run the server

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
