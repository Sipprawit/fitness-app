package services

import (
	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"fmt"
	"gorm.io/gorm"
)

// CreateClassBooking สร้างการจองคลาส โดยตรวจสอบความจุไม่ให้เกิน Capacity
func CreateClassBooking(booking entity.ClassBooking) (entity.ClassBooking, error) {
	db := config.DB()

	if booking.UserID == 0 || booking.ClassActivityID == 0 {
		return booking, fmt.Errorf("user_id หรือ class_activity_id ไม่ถูกต้อง")
	}

	// ตรวจสอบว่าผู้ใช้จองคลาสนี้แล้วหรือยัง (ที่ยังไม่ถูกยกเลิก)
	var dup entity.ClassBooking
	if err := db.Where("user_id = ? AND class_activity_id = ? AND status <> ?", booking.UserID, booking.ClassActivityID, "Cancelled").First(&dup).Error; err == nil {
		return booking, fmt.Errorf("ผู้ใช้นี้ได้จองคลาสนี้แล้ว")
	} else if err != nil && err != gorm.ErrRecordNotFound {
		return booking, err
	}

	// ดึงข้อมูลคลาสเพื่อดู Capacity
	var class entity.ClassActivity
	if err := db.First(&class, booking.ClassActivityID).Error; err != nil {
		return booking, fmt.Errorf("ไม่พบคลาสที่ต้องการจอง")
	}

	// นับจำนวนผู้จองที่ยังไม่ถูกยกเลิก
	var count int64
	if err := db.Model(&entity.ClassBooking{}).
		Where("class_activity_id = ? AND status <> ?", booking.ClassActivityID, "Cancelled").
		Count(&count).Error; err != nil {
		return booking, err
	}

	if int(count) >= class.Capacity {
		return booking, fmt.Errorf("จำนวนผู้จองเต็มแล้ว")
	}

	// กำหนดสถานะเริ่มต้น หากไม่ระบุมา
	if booking.Status == "" {
		booking.Status = "Confirmed"
	}

	if err := db.Create(&booking).Error; err != nil {
		return booking, err
	}

	// preload ความสัมพันธ์เพื่อส่งกลับ
	db.Preload("User").Preload("ClassActivity").First(&booking, booking.ID)
	return booking, nil
}

// CancelClassBooking เปลี่ยนสถานะการจองเป็น Cancelled
func CancelClassBooking(id uint) (entity.ClassBooking, error) {
	db := config.DB()

	var booking entity.ClassBooking
	if err := db.First(&booking, id).Error; err != nil {
		return booking, err
	}

	if booking.Status == "Cancelled" {
		return booking, nil
	}

	if err := db.Model(&entity.ClassBooking{}).
		Where("id = ?", id).
		Update("status", "Cancelled").Error; err != nil {
		return booking, err
	}

	db.Preload("User").Preload("ClassActivity").First(&booking, id)
	return booking, nil
}

// GetUserClassBooking ดึงข้อมูลการจองคลาสของผู้ใช้สำหรับคลาสเฉพาะ
func GetUserClassBooking(userID, classID uint) (entity.ClassBooking, error) {
	db := config.DB()

	var booking entity.ClassBooking
	err := db.Where("user_id = ? AND class_activity_id = ? AND status <> ?", userID, classID, "Cancelled").
		Preload("User").Preload("ClassActivity").
		First(&booking).Error

	return booking, err
}

// GetUserBookings ดึงข้อมูลการจองทั้งหมดของผู้ใช้
func GetUserBookings(userID uint) ([]entity.ClassBooking, error) {
	db := config.DB()

	var bookings []entity.ClassBooking
	err := db.Where("user_id = ? AND status <> ?", userID, "Cancelled").
		Preload("User").Preload("ClassActivity").
		Find(&bookings).Error

	return bookings, err
}


