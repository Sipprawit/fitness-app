package entity

import (
    "gorm.io/gorm"
)

// Customer model
type Users struct {
	gorm.Model
	
	FirstName string   `json:"first_name"`

	LastName  string   `json:"last_name"`

	Email     string   `gorm:"uniqueIndex" json:"email"`

	Age       uint8    `json:"age"`

	Password  string   `json:"-"`

	BirthDay  string   `json:"birthday"`

	GenderID  uint     `json:"gender_id"`

	Gender    *Genders `gorm:"foreignKey:GenderID" json:"gender"`
	
	Healths   []Health `gorm:"foreignKey:UserID"` // ใช้ UserID ใน Health
}


