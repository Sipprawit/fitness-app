package entity

import "time"

type Equipment struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	CreatedAt  time.Time `json:"-"`
	UpdatedAt  time.Time `json:"-"`
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	Zone       string    `json:"zone"`
	Status     string    `json:"status"`
	Condition  string    `json:"condition"`
	UsageHours int       `json:"usageHours"`
}
