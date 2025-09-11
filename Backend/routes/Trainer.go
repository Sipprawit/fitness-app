package routes

import (
    trainerController "example.com/fitness-backend/controllers/Trainer"
    trainerScheduleController "example.com/fitness-backend/controllers/TrainerSchedule"
    trainBookingController "example.com/fitness-backend/controllers/TrainBooking"
    "example.com/fitness-backend/middlewares"
    "github.com/gin-gonic/gin"
)

// TrainerRoutes registers trainer-related endpoints.
// It mirrors the grouping and auth behavior used in HealthRoutes.
func TrainerRoutes(r *gin.RouterGroup) {
    // /trainers
    trainers := r.Group("/trainers")
    trainers.Use(middlewares.Authorizes())
    {
        trainers.POST("", trainerController.CreateTrainer)
        trainers.GET("", trainerController.GetTrainers)
        trainers.GET("/:id", trainerController.GetTrainerByID)
        trainers.PUT("/:id", trainerController.UpdateTrainer)
        trainers.DELETE("/:id", trainerController.DeleteTrainer)
        trainers.POST("/:id/upload", trainerController.UploadFile)
    }

    // /trainer-schedules
    schedules := r.Group("/trainer-schedules")
    schedules.Use(middlewares.Authorizes())
    {
        schedules.POST("", trainerScheduleController.CreateTrainerSchedule)
        schedules.GET("", trainerScheduleController.GetTrainerSchedules)
        schedules.GET("/:id", trainerScheduleController.GetTrainerScheduleByID)
        schedules.GET("/allschedules/:trainerID", trainerScheduleController.GetTrainerSchedulesByTrainerID)
        schedules.PUT("/:id", trainerScheduleController.UpdateTrainerSchedule)
        schedules.DELETE("/:id", trainerScheduleController.DeleteTrainerSchedule)
    }

    // /trainers/schedules/:trainerId
    trainerSchedules := r.Group("/trainers")
    trainerSchedules.Use(middlewares.Authorizes())
    {
        trainerSchedules.GET("/schedules/:trainerId", trainerScheduleController.GetTrainerSchedulesByDate)
    }

    // /train-bookings
    bookings := r.Group("/train-bookings")
    bookings.Use(middlewares.Authorizes())
    {
        bookings.POST("", trainBookingController.CreateTrainBooking)
        bookings.GET("/user/:userID", trainBookingController.GetUserBookings)
        bookings.DELETE("/:id", trainBookingController.CancelTrainBooking)
    }
}


