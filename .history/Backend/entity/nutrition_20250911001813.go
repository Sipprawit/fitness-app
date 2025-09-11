package entity

import (
	"gorm.io/gorm"
)

// Nutrition represents a daily nutrition plan summary for a user
type Nutrition struct {
	gorm.Model
	UserID              uint    `json:"user_id"`
	Date                string  `json:"date"` // YYYY-MM-DD
	Goal                string  `json:"goal"`
	TotalCaloriesPerDay float64 `json:"total_calories_per_day"`
	Note                string  `json:"note"`

	// Meals relation for Preload("Meals")
	Meals               []Meal  `json:"meals" gorm:"foreignKey:NutritionID"`
}
