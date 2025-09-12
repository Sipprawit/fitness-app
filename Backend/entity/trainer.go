package entity

import (
	"gorm.io/gorm"
)

type Trainer struct {
	gorm.Model
	FirstName     string   `json:"first_name"`
	LastName      string   `json:"last_name"`
	Email         string   `gorm:"uniqueIndex" json:"email"`
	Password      string   `json:"password"`
	Skill         string   `json:"skill"`
	Tel           string   `json:"tel"`
	GenderID      uint     `json:"gender_id"`
	Gender        *Genders `gorm:"foreignKey:GenderID" json:"gender"`
	ProfileImage  string   `json:"profile_image"`
	AverageRating float64  `json:"averageRating" gorm:"default:0"`
	ReviewCount   uint     `json:"reviewCount" gorm:"default:0"`

	Schedules []TrainerSchedule `gorm:"foreignKey:TrainerID" json:"schedules"`
	Reviews   []Review          `gorm:"polymorphic:Reviewable;polymorphicValue:trainers" json:"reviews"`
}
