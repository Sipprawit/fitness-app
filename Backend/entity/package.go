package entity

import "gorm.io/gorm"

type Package struct {
	gorm.Model
	ID            uint      `json:"id"`
	PackageName   string    `json:"p_name"`
	Type          string    `json:"type"`
	Detail        string    `json:"detail"`
	ServiceID     uint      `json:"service_id"`
	Service       *Services `gorm:"foreignKey:ServiceID" json:"service"`
	DetailService *Services `gorm:"foreignKey:ServiceID" json:"detail_service"`
	Price         uint      `json:"price"`
}
