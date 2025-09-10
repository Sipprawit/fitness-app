package entity

import "time"

type ClassActivity struct{
	ID 			uint 		`gorm:"pimaryKey"json:"id"`
	CreateAt	time.Time 	`json:"-"`
	UpdateAt	time.Time	`json:"-"`
	Name		string		`json:"name"`
	Description	string		`json:"description"`
	MaxParticipants	int		`json:"maxParticipants"`
	Duration	int			`json:"duration"`
	imageURL	string		`json:"imageUrl"`
}