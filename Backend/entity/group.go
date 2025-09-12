package entity

import (
	"time"

	"gorm.io/gorm"
)

// WorkoutGroup: กลุ่มออกกำลังกายที่สร้างโดยผู้ใช้
type WorkoutGroup struct {
	gorm.Model
	Name       string    `json:"name" gorm:"not null"`
	Goal       string    `json:"goal"`
	MaxMembers uint      `json:"max_members"`
	Status     string    `json:"status"`
	StartDate  time.Time `json:"start_date"`

	// --- ความสัมพันธ์ (Relationships) ---
	// Group 1 กลุ่ม สร้างโดย Users 1 คน
	CreatorID uint  `json:"creator_id" gorm:"not null"`
	Creator   Users `json:"creator,omitempty"`

	// Group 1 กลุ่ม มีสมาชิก (Users) ได้หลายคน (Many-to-Many)
	Members []*Users `json:"members,omitempty" gorm:"many2many:group_members;"`
}
