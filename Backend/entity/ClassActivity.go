package entity

import "time"

type ClassActivity struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	CreatedAt           time.Time `json:"-"` // ซ่อนฟิลด์เหล่านี้จาก JSON
	UpdatedAt           time.Time `json:"-"`
	Name                string    `json:"name"`
	Description         string    `json:"description"`
	Date                string    `json:"date"`      // YYYY-MM-DD
	StartTime           string    `json:"startTime"` // HH:mm
	EndTime             string    `json:"endTime"`   // HH:mm
	Location            string    `json:"location"`
	Capacity            int       `json:"capacity"`
	ImageURL            string    `json:"imageUrl"`
	CurrentParticipants int       `gorm:"-" json:"currentParticipants"`
	AverageRating       float64   `json:"averageRating" gorm:"default:0"`
	ReviewCount         uint      `json:"reviewCount" gorm:"default:0"`
	Reviews             []Review  `gorm:"polymorphic:Reviewable;polymorphicValue:classes" json:"reviews"`
}
