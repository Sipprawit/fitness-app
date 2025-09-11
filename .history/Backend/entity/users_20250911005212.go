package entity

import (
	"gorm.io/gorm"
)

// Customer model
type Users struct {
	gorm.Model

	Username  string `gorm:"uniqueIndex" json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `gorm:"uniqueIndex" json:"email"`
	Phone     string `json:"phone"`
	Avatar    string `json:"avatar"`
	Age       uint8  `json:"age"`
	Password  string `json:"-"`
	BirthDay  string `json:"birthday"`
	GenderID  uint   `json:"gender_id"`

	Gender *Genders `gorm:"foreignKey:GenderID" json:"gender"`

	Healths []Health `gorm:"foreignKey:UserID"` // ใช้ UserID ใน Health

	// ความสัมพันธ์กับการจองเทรนเนอร์ของผู้ใช้
	TrainBookings []TrainBooking `gorm:"foreignKey:UsersID" json:"train_bookings"`
}
