package TrainerSchedule

import (
    "net/http"
    "strconv"
    "time"

    "example.com/fitness-backend/entity"
    "example.com/fitness-backend/services"
    "github.com/gin-gonic/gin"
)

// POST /trainer-schedules
func CreateTrainerSchedule(c *gin.Context) {
    var trainerSchedule entity.TrainerSchedule
    if err := c.ShouldBindJSON(&trainerSchedule); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    newSchedule, err := services.CreateTrainerSchedule(trainerSchedule)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, gin.H{
        "message": "เพิ่มตารางเวลาเทรนเนอร์สำเร็จ",
        "data":    newSchedule,
    })
}

// GET /trainer-schedules
func GetTrainerSchedules(c *gin.Context) {
    schedules, err := services.GetAllSchedules()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, schedules)
}

// GET /trainer-schedules/:id
func GetTrainerScheduleByID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }
    schedule, err := services.GetScheduleByID(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบตารางเวลา"})
        return
    }
    c.JSON(http.StatusOK, schedule)
}

// GET /trainer-schedules/:trainerID/schedules
func GetTrainerSchedulesByTrainerID(c *gin.Context) {
    trainerID, err := strconv.Atoi(c.Param("trainerID"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Trainer ID"})
        return
    }
    schedules, err := services.GetSchedulesByTrainer(uint(trainerID))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, schedules)
}

// PUT /trainer-schedules/:id
func UpdateTrainerSchedule(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }
    var trainerSchedule entity.TrainerSchedule
    if err := c.ShouldBindJSON(&trainerSchedule); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    updated, err := services.UpdateSchedule(uint(id), trainerSchedule)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, updated)
}

// DELETE /trainer-schedules/:id
func DeleteTrainerSchedule(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }
    err = services.DeleteSchedule(uint(id))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "ลบตารางเวลาสำเร็จ"})
}

// GET /trainer-schedules/trainer/:trainerId/date?date=YYYY-MM-DD
func GetTrainerSchedulesByDate(c *gin.Context) {
    trainerIdStr := c.Param("trainerId")
    trainerId, err := strconv.ParseUint(trainerIdStr, 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสเทรนเนอร์ไม่ถูกต้อง"})
        return
    }

    dateStr := c.Query("date")
    if dateStr == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ต้องระบุวันที่ (date=YYYY-MM-DD)"})
        return
    }

    date, err := time.Parse("2006-01-02", dateStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)"})
        return
    }

    schedules, err := services.GetTrainerSchedulesByDate(uint(trainerId), date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลตารางเวลาได้"})
        return
    }

    c.JSON(http.StatusOK, schedules)
}
