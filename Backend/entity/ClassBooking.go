package entity

import (
    "gorm.io/gorm"
)

type ClassBooking struct {
	gorm.Model
	BookingStatus  	string	`json:"classbooking_status"`

	ClassID *uint	`json:"class_id"`
	ClassActivity   ClassActivity `gorm:"foreignKey:ClassID" json:"class"`


	usersID uint  `json:"user_id"`
	users   Users `gorm:"foreignKey:usersID" json:"users"`

}