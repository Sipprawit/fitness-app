package entity

import (
    "gorm.io/gorm"
    "time"
)

// ตารางการจองคลาสของเทรนเนอร์
type TrainBooking struct {
	gorm.Model
	BookingStatus string `json:"booking_status"`

	// ความสัมพันธ์กับสมาชิก
	UsersID uint  `json:"user_id"`
	Users   Users `gorm:"foreignKey:UsersID" json:"user"`

	// ความสัมพันธ์กับตารางเวลาเทรนเนอร์
	ScheduleID uint           `json:"schedule_id"`
	Schedule   TrainerSchedule `gorm:"foreignKey:ScheduleID" json:"schedule"`

	// เวลาเพิ่มให้สามารถบันทึกวันจองและเวลาได้ (optional)
	BookingDate time.Time `json:"booking_date"`
}