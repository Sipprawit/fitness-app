package entity

import (
	"time"

	"gorm.io/gorm"
)
a
type Activity struct {
	gorm.Model
	UserID   uint      `json:"user_id"`
	HealthID uint      `json:"health_id"`
	Health   Health    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
	Type     string    `json:"type"`
	Distance float64   `json:"distance"`
	Duration float64   `json:"duration"`
	Calories float64   `json:"calories"`
	Date     time.Time `json:"date"`
}
