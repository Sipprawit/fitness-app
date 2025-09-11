package services

import (
	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"fmt"
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
	db.Preload("Users").Preload("Schedule").First(&booking, booking.ID)
	return booking, nil
}

// GetTrainBookingByID ดึงข้อมูลการจองด้วย ID
func GetTrainBookingByID(id uint) (entity.TrainBooking, error) {
	var booking entity.TrainBooking
	err := config.DB().Preload("Users").Preload("Schedule").First(&booking, id).Error
	return booking, err
}

// GetBookingsByUserID ดึงข้อมูลการจองทั้งหมดของสมาชิกคนหนึ่ง
func GetBookingsByUserID(userID uint) ([]entity.TrainBooking, error) {
	var bookings []entity.TrainBooking
	err := config.DB().
		Where("users_id = ?", userID).
		Preload("Users").
		Preload("Schedule").
		Find(&bookings).Error
	return bookings, err
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

