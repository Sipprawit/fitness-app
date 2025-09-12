package entity

import "gorm.io/gorm"

type Services struct {
	gorm.Model
	ID      uint   `json:"id"`
	Service string `json:"service"`
	Detail  string `json:"detail"`
}
