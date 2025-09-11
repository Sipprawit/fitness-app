package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"time"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/controllers/genders"
	"example.com/fitness-backend/controllers/uploads"
	"example.com/fitness-backend/controllers/users"
	"example.com/fitness-backend/middlewares"
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

	// Public Routes (no authentication required)
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)
	r.POST("/upload", uploads.Upload)
	r.GET("/genders", genders.GetAll)
	routes.PublicClassRoutes(r)

	// API Group (with authentication)
	api := r.Group("/api")
	{
		api.Use(middlewares.Authorizes())

		// User Routes
		api.PUT("/user/:id", users.Update)
		api.GET("/users", users.GetAll)
		api.GET("/user/:id", users.Get)
		api.DELETE("/user/:id", users.Delete)

		// Health & Activity Routes
		routes.HealthRoutes(api)

		// Trainer-related Routes
		routes.TrainerRoutes(api)

		// Class Routes
		routes.ClassRoutes(api)

		// Equipment Routes
		routes.EquipmentRoutes(api)

		// Facility Routes
		routes.FacilityRoutes(api)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server
	r.Run("localhost:" + PORT)
}
