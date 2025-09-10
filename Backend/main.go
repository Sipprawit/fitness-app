package main


import (

   "net/http"


   "github.com/gin-gonic/gin"

    
   "example.com/fitness-backend/config"

   "example.com/fitness-backend/controllers/genders"

   "example.com/fitness-backend/controllers/users"

   "example.com/fitness-backend/middlewares"

   "example.com/fitness-backend/controllers/Trainer"
   
   "example.com/fitness-backend/controllers/TrainerSchedule"

   "example.com/fitness-backend/controllers/TrainBooking" 

)


const PORT = "8000"


func main() {


   // open connection database

   config.ConnectionDB()


   // Generate databases

   config.SetupDatabase()


   r := gin.Default()

   r.Use(CORSMiddleware())
   
   r.Static("/uploads", "./uploads")


   // Auth Route

   r.POST("/signup", users.SignUp)

   r.POST("/signin", users.SignIn)

   r.POST("/upload", Trainer.UploadFile)


   router := r.Group("/")

   {

       router.Use(middlewares.Authorizes())


       // User Route

       router.PUT("/user/:id", users.Update)
       router.GET("/users", users.GetAll)
       router.GET("/user/:id", users.Get)
       router.DELETE("/user/:id", users.Delete)

       //Trainer Routes
       
       router.POST("/trainers", Trainer.CreateTrainer)
       router.GET("/trainers", Trainer.GetTrainers)
       router.GET("/trainers/:id", Trainer.GetTrainerByID)
       router.PUT("/trainers/:id", Trainer.UpdateTrainer)
       router.DELETE("/trainers/:id", Trainer.DeleteTrainer)
       router.POST("/trainers/:id/upload", Trainer.UploadFile)

       // TrainerSchedule Routes
       
       router.POST("/trainer-schedules", TrainerSchedule.CreateTrainerSchedule)
       router.GET("/trainer-schedules", TrainerSchedule.GetTrainerSchedules)
       router.GET("/trainer-schedules/:id", TrainerSchedule.GetTrainerScheduleByID)
       router.GET("/trainer-schedules/allschedules/:trainerID", TrainerSchedule.GetTrainerSchedulesByTrainerID)
       router.PUT("/trainer-schedules/:id", TrainerSchedule.UpdateTrainerSchedule)
       router.DELETE("/trainer-schedules/:id", TrainerSchedule.DeleteTrainerSchedule)
       router.GET("/trainers/schedules/:trainerId", TrainerSchedule.GetTrainerSchedulesByDate)

       // TrainBooking Routes
       router.POST("/train-bookings", TrainBooking.CreateTrainBooking)
       router.GET("/train-bookings/user/:userID", TrainBooking.GetUserBookings)
       router.DELETE("/train-bookings/:id", TrainBooking.CancelTrainBooking)

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