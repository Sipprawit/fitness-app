package entity

import (
    "gorm.io/gorm"
)

type Users struct {
    gorm.Model
    FirstName string   `json:"first_name"`  // ใช้ json tag ให้ตรงกับ API

    LastName  string   `json:"last_name"`

    Email     string   `json:"email"`

    Age       uint8    `json:"age"`

    Password  string   `json:"-"`           // ไม่ต้องส่ง password กลับ

    BirthDay  string   `json:"birthDay"`

    GenderID  uint     `json:"gender_id"`

    Gender    *Genders `gorm:"foreignKey:GenderID" json:"gender"`
    
    Actor     string   `json:"actor"`       // บทบาท
}
