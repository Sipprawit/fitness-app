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
}
