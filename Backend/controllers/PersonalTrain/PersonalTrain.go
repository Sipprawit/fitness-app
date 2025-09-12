package PersonalTrain

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"example.com/fitness-backend/services"
	"github.com/gin-gonic/gin"
)

// GET /personal-training/customer/:customerID
// ฟังก์ชันสำหรับดึงข้อมูลโปรแกรมการฝึกส่วนตัวของลูกค้าคนหนึ่ง
func GetPersonalTrainingProgramsByCustomerID(c *gin.Context) {
	customerIDStr := c.Param("customerID")
	customerID, err := strconv.Atoi(customerIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสลูกค้าไม่ถูกต้อง"})
		return
	}

	programs, err := services.GetPersonalTrainingProgramsByCustomerID(uint(customerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลโปรแกรมการฝึกได้"})
		return
	}

	c.JSON(http.StatusOK, programs)
}

// GET /personal-training/:id
// ฟังก์ชันสำหรับดึงข้อมูลโปรแกรมการฝึกส่วนตัวเฉพาะ ID
func GetPersonalTrainingProgramByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสโปรแกรมไม่ถูกต้อง"})
		return
	}

	program, err := services.GetPersonalTrainingProgramByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลโปรแกรมการฝึกได้"})
		return
	}

	c.JSON(http.StatusOK, program)
}

// GET /personal-training/trainer
// ฟังก์ชันสำหรับดึงข้อมูลโปรแกรมการฝึกส่วนตัวของลูกค้าทั้งหมดที่เทรนเนอร์ดูแล
func GetPersonalTrainingProgramsByTrainerID(c *gin.Context) {
	// ดึงข้อมูลจาก context ที่ middleware ตั้งค่าไว้
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบข้อมูลผู้ใช้"})
		return
	}

	actor, exists := c.Get("actor")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบข้อมูล actor"})
		return
	}

	// ตรวจสอบว่าเป็นเทรนเนอร์หรือไม่
	if actor != "trainer" {
		c.JSON(http.StatusForbidden, gin.H{"error": "เฉพาะเทรนเนอร์เท่านั้นที่สามารถเข้าถึงได้"})
		return
	}

	// ใช้ user_id ของเทรนเนอร์ที่ล็อกอินอยู่
	trainerID := userID.(uint)

	programs, err := services.GetPersonalTrainingProgramsByTrainerID(trainerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลโปรแกรมการฝึกได้"})
		return
	}

	c.JSON(http.StatusOK, programs)
}

// POST /personal-training
// ฟังก์ชันสำหรับสร้างโปรแกรมการฝึกส่วนตัวใหม่
func CreatePersonalTrainingProgram(c *gin.Context) {
	var requestData struct {
		UserID    uint   `json:"user_id"`
		TrainerID uint   `json:"trainer_id"`
		Format    string `json:"format"`
		Date      string `json:"date"`
		Time      string `json:"time"`
		GoalID    uint   `json:"goal_id"`
	}

	if err := c.ShouldBindJSON(&requestData); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	fmt.Printf("Received request data: %+v\n", requestData)

	// Parse date string to time.Time
	var parsedDate time.Time
	var err error
	if requestData.Date != "" {
		// Try different date formats
		dateFormats := []string{
			"2006-01-02",               // YYYY-MM-DD
			"2006-01-02T15:04:05Z",     // ISO 8601
			"2006-01-02T15:04:05.000Z", // ISO 8601 with milliseconds
			time.RFC3339,               // RFC3339
		}

		for _, format := range dateFormats {
			parsedDate, err = time.Parse(format, requestData.Date)
			if err == nil {
				break
			}
		}

		if err != nil {
			fmt.Printf("Error parsing date '%s': %v\n", requestData.Date, err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบวันที่ไม่ถูกต้อง"})
			return
		}
	} else {
		parsedDate = time.Now()
	}

	// Create PersonalTrain entity
	program := entity.PersonalTrain{
		UserID:    requestData.UserID,
		TrainerID: requestData.TrainerID,
		Format:    requestData.Format,
		Date:      parsedDate,
		Time:      requestData.Time,
		GoalID:    requestData.GoalID,
	}

	fmt.Printf("Created program entity: %+v\n", program)

	// Validate required fields
	if program.UserID == 0 {
		fmt.Printf("UserID is 0, this is invalid\n")
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id ไม่ถูกต้อง"})
		return
	}

	if program.TrainerID == 0 {
		fmt.Printf("TrainerID is 0, this is invalid\n")
		c.JSON(http.StatusBadRequest, gin.H{"error": "trainer_id ไม่ถูกต้อง"})
		return
	}

	// Set default GoalID if not provided
	if program.GoalID == 0 {
		program.GoalID = 1
		fmt.Printf("Set default GoalID to 1\n")
	}

	// Validate that the user exists
	var user entity.Users
	if err := config.DB().First(&user, program.UserID).Error; err != nil {
		fmt.Printf("User with ID %d not found: %v\n", program.UserID, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลลูกค้า"})
		return
	}

	// Validate that the trainer exists
	var trainer entity.Trainer
	if err := config.DB().First(&trainer, program.TrainerID).Error; err != nil {
		fmt.Printf("Trainer with ID %d not found: %v\n", program.TrainerID, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลเทรนเนอร์"})
		return
	}

	fmt.Printf("Validation passed - User: %s %s, Trainer: %s %s\n",
		user.FirstName, user.LastName, trainer.FirstName, trainer.LastName)

	// Validate that the goal exists
	var goal entity.Nutrition
	if err := config.DB().First(&goal, program.GoalID).Error; err != nil {
		fmt.Printf("Goal with ID %d not found: %v\n", program.GoalID, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลเป้าหมาย"})
		return
	}

	fmt.Printf("Goal validation passed - Goal: %s\n", goal.Goal)

	newProgram, err := services.CreatePersonalTrainingProgram(program)
	if err != nil {
		fmt.Printf("Error creating program: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างโปรแกรมการฝึกได้"})
		return
	}

	fmt.Printf("Successfully created personal training program with ID: %d\n", newProgram.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "สร้างโปรแกรมการฝึกสำเร็จ",
		"data":    newProgram,
	})
}

// PUT /personal-training/:id
// ฟังก์ชันสำหรับอัปเดตโปรแกรมการฝึกส่วนตัว
func UpdatePersonalTrainingProgram(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสโปรแกรมไม่ถูกต้อง"})
		return
	}

	var program entity.PersonalTrain
	if err := c.ShouldBindJSON(&program); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	updatedProgram, err := services.UpdatePersonalTrainingProgram(uint(id), program)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตโปรแกรมการฝึกได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "อัปเดตโปรแกรมการฝึกสำเร็จ",
		"data":    updatedProgram,
	})
}

// DELETE /personal-training/:id
// ฟังก์ชันสำหรับลบโปรแกรมการฝึกส่วนตัว
func DeletePersonalTrainingProgram(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสโปรแกรมไม่ถูกต้อง"})
		return
	}

	err = services.DeletePersonalTrainingProgram(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบโปรแกรมการฝึกได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบโปรแกรมการฝึกสำเร็จ"})
}
