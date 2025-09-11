package entity

import (
	"time"

	"gorm.io/gorm"
)

// Meal represents macro nutrients for a nutrition plan
type Meal struct {
	gorm.Model
	NutritionID uint    `json:"nutrition_id"`
	UserID      uint    `json:"user_id"`
	ProteinG    float64 `json:"protein_g"`
	FatG        float64 `json:"fat_g"`
	CarbG       float64 `json:"carb_g"`
}
