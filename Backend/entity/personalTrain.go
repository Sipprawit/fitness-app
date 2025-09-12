package entity

import (
	"gorm.io/gorm"

	"time"
)

type PersonalTrain struct {
	gorm.Model
	UserID      uint       `json:"user_id" gorm:"column:user_id"`
	User        *Users     `gorm:"foreignKey:UserID" json:"user"`
	GoalID      uint       `json:"goal_id" gorm:"column:goal_id"`
	Goal        *Nutrition `gorm:"foreignKey:GoalID" json:"goal"`
	Format      string     `json:"format" gorm:"column:format"`
	Date        time.Time  `json:"date" gorm:"column:date"`
	TrainerID   uint       `json:"trainer_id" gorm:"column:trainer_id"`
	TrainerName *Trainer   `gorm:"foreignKey:TrainerID" json:"trainer_name"`
	Time        string     `json:"time" gorm:"column:time"`
}
