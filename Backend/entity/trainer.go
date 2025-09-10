package entity

import (
    "gorm.io/gorm"
)

type Trainer struct {
	gorm.Model
	FirstName   string   `json:"first_name"`

	LastName    string   `json:"last_name"`

	Email       string   `gorm:"uniqueIndex" json:"email"`
	
	Password    string   `json:"-"`
	// อาจจะมีฟิลด์อื่นๆ สำหรับเทรนเนอร์โดยเฉพาะ เช่น
	// Specialization string `json:"specialization"`
	// Certification  string `json:"certification"`
}