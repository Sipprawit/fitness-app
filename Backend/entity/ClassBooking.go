package entity

import (
	"gorm.io/gorm"
)

// การจองคลาสกลุ่ม (Class Activity)
type ClassBooking struct {
	gorm.Model

	// สถานะการจอง เช่น PENDING, CONFIRMED, CANCELLED
	Status string `json:"status"`

	// ผู้ที่ทำการจอง
	UserID uint  `json:"user_id"`
	User   Users `gorm:"foreignKey:UserID" json:"user"`

	// คลาสที่ถูกจอง
	ClassActivityID uint          `json:"class_activity_id"`
	ClassActivity   ClassActivity `gorm:"foreignKey:ClassActivityID" json:"class_activity"`
}


