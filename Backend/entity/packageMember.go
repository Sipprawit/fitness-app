package entity

import "gorm.io/gorm"

type PackageMember struct {
	gorm.Model
	UserID   uint   `gorm:"uniqueIndex" json:"user_id"`
	Username *Users `gorm:"foreignKey:UserID" json:"username"`

	PackageID uint     `json:"package_id"`
	Package   *Package `gorm:"foreignKey:PackageID" json:"package"`
}