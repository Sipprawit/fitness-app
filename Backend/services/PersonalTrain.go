package services

import (
	"fmt"
	"time"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
)

// GetPersonalTrainingProgramsByCustomerID ดึงข้อมูลโปรแกรมการฝึกส่วนตัวของลูกค้าคนหนึ่ง
func GetPersonalTrainingProgramsByCustomerID(customerID uint) ([]entity.PersonalTrain, error) {
	var programs []entity.PersonalTrain

	err := config.DB().
		Preload("User").
		Preload("TrainerName").
		Preload("Goal").
		Where("user_id = ? AND deleted_at IS NULL", customerID).
		Find(&programs).Error

	if err != nil {
		fmt.Printf("Error querying personal training programs: %v\n", err)
		return programs, err
	}

	fmt.Printf("Found personal training programs for customer %d: %d\n", customerID, len(programs))
	return programs, nil
}

// GetPersonalTrainingProgramByID ดึงข้อมูลโปรแกรมการฝึกส่วนตัวเฉพาะ ID
func GetPersonalTrainingProgramByID(id uint) (entity.PersonalTrain, error) {
	var program entity.PersonalTrain

	err := config.DB().
		Preload("User").
		Preload("TrainerName").
		Preload("Goal").
		Where("id = ? AND deleted_at IS NULL", id).
		First(&program).Error

	if err != nil {
		fmt.Printf("Error querying personal training program by ID %d: %v\n", id, err)
		return program, err
	}

	fmt.Printf("Found personal training program with ID %d\n", program.ID)
	return program, nil
}

// GetPersonalTrainingProgramsByTrainerID ดึงข้อมูลโปรแกรมการฝึกส่วนตัวของลูกค้าทั้งหมดที่เทรนเนอร์ดูแล
func GetPersonalTrainingProgramsByTrainerID(trainerID uint) ([]entity.PersonalTrain, error) {
	var programs []entity.PersonalTrain

	err := config.DB().
		Preload("User").
		Preload("TrainerName").
		Preload("Goal").
		Where("trainer_id = ? AND deleted_at IS NULL", trainerID).
		Find(&programs).Error

	if err != nil {
		fmt.Printf("Error querying personal training programs for trainer: %v\n", err)
		return programs, err
	}

	fmt.Printf("Found personal training programs for trainer %d: %d\n", trainerID, len(programs))
	return programs, nil
}

// CreatePersonalTrainingProgram สร้างโปรแกรมการฝึกส่วนตัวใหม่
func CreatePersonalTrainingProgram(program entity.PersonalTrain) (entity.PersonalTrain, error) {
	db := config.DB()

	fmt.Printf("Received program data: %+v\n", program)
	fmt.Printf("UserID: %d, TrainerID: %d, GoalID: %d\n", program.UserID, program.TrainerID, program.GoalID)

	if program.UserID == 0 || program.TrainerID == 0 {
		fmt.Printf("Invalid IDs - UserID: %d, TrainerID: %d\n", program.UserID, program.TrainerID)
		return program, fmt.Errorf("user_id หรือ trainer_id ไม่ถูกต้อง")
	}

	// Set default GoalID if not provided
	if program.GoalID == 0 {
		program.GoalID = 1
		fmt.Printf("Set default GoalID to 1\n")
	}

	fmt.Printf("Creating personal training program: %+v\n", program)

	// แปลง Date string เป็น time.Time ถ้าจำเป็น
	if program.Date.IsZero() {
		fmt.Printf("Date is zero, setting to current time\n")
		program.Date = time.Now()
	}

	err := db.Create(&program).Error
	if err != nil {
		fmt.Printf("Error creating personal training program: %v\n", err)
		return program, err
	}

	fmt.Printf("Successfully created personal training program with ID: %d\n", program.ID)

	// Preload relationships
	db.Preload("User").Preload("TrainerName").Preload("Goal").First(&program, program.ID)
	return program, nil
}

// UpdatePersonalTrainingProgram อัปเดตโปรแกรมการฝึกส่วนตัว
func UpdatePersonalTrainingProgram(id uint, program entity.PersonalTrain) (entity.PersonalTrain, error) {
	db := config.DB()

	var existingProgram entity.PersonalTrain
	if err := db.First(&existingProgram, id).Error; err != nil {
		return program, err
	}

	err := db.Model(&existingProgram).Updates(program).Error
	if err != nil {
		return program, err
	}

	// Preload relationships
	db.Preload("User").Preload("TrainerName").Preload("Goal").First(&existingProgram, id)
	return existingProgram, nil
}

// DeletePersonalTrainingProgram ลบโปรแกรมการฝึกส่วนตัว (soft delete)
func DeletePersonalTrainingProgram(id uint) error {
	db := config.DB()

	var program entity.PersonalTrain
	if err := db.First(&program, id).Error; err != nil {
		return err
	}

	return db.Delete(&program).Error
}
