package entity

import "time"

type Facility struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
	Name      string    `json:"name"`
	Zone      string    `json:"zone"`
	Status    string    `json:"status"`
	Capacity  int       `json:"capacity"`
}
