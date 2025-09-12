package services

import (
	"fmt"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"gorm.io/gorm"
)

// CreateTrainBooking สร้างการจองใหม่ในฐานข้อมูล
func CreateTrainBooking(booking entity.TrainBooking) (entity.TrainBooking, error) {
	db := config.DB()

	if booking.UsersID == 0 || booking.ScheduleID == 0 {
		return booking, fmt.Errorf("user_id หรือ schedule_id ไม่ถูกต้อง")
	}

	// ตรวจสอบว่ามีการจองแล้วหรือยัง
	var existingBooking entity.TrainBooking
	result := db.Where("schedule_id = ?", booking.ScheduleID).First(&existingBooking)
	if result.Error == nil {
		return booking, fmt.Errorf("a booking for this schedule is already taken")
	} else if result.Error != gorm.ErrRecordNotFound {
		return booking, result.Error
	}

	// สร้าง booking และอัปเดต status ของ schedule ใน transaction
	err := db.Transaction(func(tx *gorm.DB) error {
		// 1. create booking
		if err := tx.Create(&booking).Error; err != nil {
			return err
		}

		// 2. update schedule status = "Booked"
		if err := tx.Model(&entity.TrainerSchedule{}).
			Where("id = ?", booking.ScheduleID).
			Update("status", "Booked").Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return booking, err
	}

	// preload relationships
	db.Preload("Users").Preload("Schedule").Preload("Schedule.Trainer").First(&booking, booking.ID)
	return booking, nil
}

// GetTrainBookingByID ดึงข้อมูลการจองด้วย ID
func GetTrainBookingByID(id uint) (entity.TrainBooking, error) {
	var booking entity.TrainBooking
	err := config.DB().Preload("Users").Preload("Schedule").Preload("Schedule.Trainer").First(&booking, id).Error
	return booking, err
}

// GetBookingsByUserID ดึงข้อมูลการจองทั้งหมดของสมาชิกคนหนึ่ง
func GetBookingsByUserID(userID uint) ([]entity.TrainBooking, error) {
	var bookings []entity.TrainBooking
	err := config.DB().
		Where("users_id = ?", userID).
		Preload("Users").
		Preload("Schedule").
		Preload("Schedule.Trainer").
		Find(&bookings).Error
	return bookings, err
}

// GetCustomersByTrainerID ดึงข้อมูลลูกค้าที่จองเทรนเนอร์คนหนึ่ง
func GetCustomersByTrainerID(trainerID uint) ([]entity.Users, error) {
	var customers []entity.Users

	// Debug: ตรวจสอบข้อมูลในฐานข้อมูล
	var allTrainBookings []entity.TrainBooking
	config.DB().Find(&allTrainBookings)
	fmt.Printf("Total train bookings in DB: %d\n", len(allTrainBookings))

	var allTrainerSchedules []entity.TrainerSchedule
	config.DB().Find(&allTrainerSchedules)
	fmt.Printf("Total trainer schedules in DB: %d\n", len(allTrainerSchedules))

	var schedulesForTrainer []entity.TrainerSchedule
	config.DB().Where("trainer_id = ?", trainerID).Find(&schedulesForTrainer)
	fmt.Printf("Schedules for trainer %d: %d\n", trainerID, len(schedulesForTrainer))

	// วิธีที่ 1: ใช้ Raw SQL เพื่อดึงข้อมูล Users โดยตรง
	var rawCustomers []struct {
		ID        uint   `json:"id"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
	}

	err := config.DB().Raw(`
		SELECT DISTINCT u.id, u.first_name, u.last_name, u.email
		FROM users u
		INNER JOIN train_bookings tb ON u.id = tb.users_id
		INNER JOIN trainer_schedules ts ON tb.schedule_id = ts.id
		WHERE ts.trainer_id = ? AND tb.deleted_at IS NULL AND u.deleted_at IS NULL
	`, trainerID).Scan(&rawCustomers).Error

	if err != nil {
		fmt.Printf("Error querying customers with raw SQL: %v\n", err)
		return customers, err
	}

	fmt.Printf("Found customers with raw SQL: %d\n", len(rawCustomers))

	// แปลง raw results เป็น entity.Users
	for _, rawCustomer := range rawCustomers {
		customer := entity.Users{
			Model:     gorm.Model{ID: rawCustomer.ID},
			FirstName: rawCustomer.FirstName,
			LastName:  rawCustomer.LastName,
			Email:     rawCustomer.Email,
		}
		customers = append(customers, customer)
	}

	fmt.Printf("Found unique customers: %d\n", len(customers))

	return customers, nil
}

// CancelTrainBooking ยกเลิกการจองด้วย ID (soft delete และเปลี่ยนสถานะ)
func CancelTrainBooking(id uint) error {
	db := config.DB()

	var booking entity.TrainBooking
	if err := db.First(&booking, id).Error; err != nil {
		return err
	}

	return db.Transaction(func(tx *gorm.DB) error {
		// 1) อัปเดตสถานะการจองเป็น Cancelled
		if err := tx.Model(&entity.TrainBooking{}).
			Where("id = ?", booking.ID).
			Update("booking_status", "Cancelled").Error; err != nil {
			return err
		}

		// 2) ลบแบบ soft delete (gorm.Model จะตั้งค่า deleted_at)
		if err := tx.Delete(&booking).Error; err != nil {
			return err
		}

		// 3) คืนสถานะตารางเวลาเป็น Available
		if err := tx.Model(&entity.TrainerSchedule{}).
			Where("id = ?", booking.ScheduleID).
			Update("status", "Available").Error; err != nil {
			return err
		}

		return nil
	})
}

// GetCustomerBookedTimes ดึงข้อมูลเวลาที่ลูกค้าจองไว้
func GetCustomerBookedTimes(customerID uint) ([]entity.TrainBooking, error) {
	var bookings []entity.TrainBooking

	fmt.Printf("Fetching booked times for customer ID: %d\n", customerID)

	err := config.DB().
		Preload("Users").
		Preload("Schedule").
		Preload("Schedule.Trainer").
		Where("users_id = ? AND deleted_at IS NULL", customerID).
		Order("booking_date ASC").
		Find(&bookings).Error

	if err != nil {
		fmt.Printf("Error fetching booked times: %v\n", err)
		return nil, fmt.Errorf("failed to fetch customer booked times: %w", err)
	}

	fmt.Printf("Found %d booked times for customer %d\n", len(bookings), customerID)
	return bookings, nil
}
