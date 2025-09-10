package entity

import (
	"time"

	"gorm.io/gorm"
)

// Meal represents a meal entry under a nutrition plan
type Meal struct {
	gorm.Model
	NutritionID uint      `json:"nutrition_id"`
	UserID      uint      `json:"user_id"`
	Name        string    `json:"name"`
	Calories    float64   `json:"calories"`
	Protein     float64   `json:"protein"`
	Carbs       float64   `json:"carbs"`
	Fat         float64   `json:"fat"`
	Date        time.Time `json:"date"`
}
