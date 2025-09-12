package entity

import "gorm.io/gorm"

// Review: ข้อมูลรีวิวสำหรับ Class หรือ Trainer
type Review struct {
	gorm.Model
	Rating  int    `json:"rating" gorm:"not null"`
	Comment string `json:"comment"`

	// --- ความสัมพันธ์ (Relationships) ---
	// Review 1 รีวิว เขียนโดย Users 1 คน
	UserID uint  `json:"user_id" gorm:"not null"`
	User   Users `json:"user,omitempty"`

	// Polymorphic Relationship: รีวิวนี้เป็นของอะไร (Class หรือ Trainer)
	ReviewableID   uint   `json:"reviewable_id" gorm:"index"`
	ReviewableType string `json:"reviewable_type" gorm:"index"` // จะเก็บค่าเป็น "classes" หรือ "trainers"
}
