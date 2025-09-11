package entity

import (
    "gorm.io/gorm"
)

type Health struct {
    gorm.Model
    Weight     float64    `json:"weight"`
    Height     float64    `json:"height"`
    Fat        float64    `json:"fat"`
    Pressure   string     `json:"pressure"`
    Bmi        float64    `json:"bmi"`
    Status     string     `json:"status"`
    Date       string     `json:"date"`
    UserID     uint       `json:"user_id"` 
    User       *Users     `gorm:"foreignKey:UserID" json:"-"` 
    Activities []Activity `gorm:"foreignKey:HealthID"`
}
