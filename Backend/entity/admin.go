package entity

import (
    "gorm.io/gorm"
)

// Admin model
type Admin struct {
	gorm.Model
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `gorm:"uniqueIndex" json:"email"`
	Password  string `json:"-"`
}