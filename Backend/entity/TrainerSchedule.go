package entity

import (
    "time"
    "gorm.io/gorm"
)

type TrainerSchedule struct {
    gorm.Model
    AvailableDate   time.Time `json:"available_date"`
    StartTime       time.Time `json:"start_time"`
    EndTime         time.Time `json:"end_time"`
    
    Status    string   `json:"status" gorm:"default:'Available'"`

    TrainerID   uint      `json:"trainer_id"`     // FK ไปยัง Trainer
    Trainer     Trainer   `gorm:"foreignKey:TrainerID" json:"trainer,omitempty"`

    Bookings []TrainBooking `gorm:"foreignKey:ScheduleID" json:"booking,omitempty"`

}