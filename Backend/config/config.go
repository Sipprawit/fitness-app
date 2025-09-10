package config

import (
	"fmt"
	"time"

	"example.com/fitness-backend/entity"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// SecretKey สำหรับ JWT
var SecretKey string = "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx"

var db *gorm.DB

// HashPassword แปลง password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash ตรวจสอบ password
func CheckPasswordHash(password, hash []byte) bool {
	err := bcrypt.CompareHashAndPassword(hash, password)
	return err == nil
}

// DB คืนค่า gorm.DB
func DB() *gorm.DB {
	return db
}

// ConnectionDB เชื่อม sqlite
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

// SetupDatabase สร้าง table และข้อมูลเริ่มต้น
// ... (import statements)

// SetupDatabase สร้าง table และข้อมูลเริ่มต้น
func SetupDatabase() {
	db.AutoMigrate(
		&entity.Genders{},
		&entity.Users{},   
		&entity.Trainer{}, 
		&entity.Admin{},   
		&entity.Health{},
		&entity.Activity{},
		&entity.Nutrition{},
		&entity.Meal{},
	)

	// Seed genders (idempotent)
	var male entity.Genders
	db.Where(entity.Genders{Gender: "ชาย"}).FirstOrInit(&male)
	if male.ID == 0 {
		db.Create(&entity.Genders{Gender: "ชาย"})
	}

	var female entity.Genders
	db.Where(entity.Genders{Gender: "หญิง"}).FirstOrInit(&female)
	if female.ID == 0 {
		db.Create(&entity.Genders{Gender: "หญิง"})
	}

	var other entity.Genders
	db.Where(entity.Genders{Gender: "อื่นๆ"}).FirstOrInit(&other)
	if other.ID == 0 {
		db.Create(&entity.Genders{Gender: "อื่นๆ"})
	}

	// Password & Birthday default
	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")
	formattedBirthDay := BirthDay.Format("2006-01-02")

	// --- สร้างข้อมูลเริ่มต้นใหม่ ---

	// Admin
	var admin entity.Admin
	db.Where(entity.Admin{Email: "admin@gmail.com"}).FirstOrInit(&admin)
	if admin.ID == 0 {
		db.Create(&entity.Admin{FirstName: "Admin", LastName: "User", Email: "admin@gmail.com", Password: hashedPassword})
	}

	// Trainer
	var trainer entity.Trainer
	db.Where(entity.Trainer{Email: "trainer@gmail.com"}).FirstOrInit(&trainer)
	if trainer.ID == 0 {
		db.Create(&entity.Trainer{FirstName: "Trainer", LastName: "User", Email: "trainer@gmail.com", Password: hashedPassword})
	}

	// Customer
	var customer entity.Users
	db.Where(entity.Users{Email: "customer@gmail.com"}).FirstOrInit(&customer)
	if customer.ID == 0 {
		db.Create(&entity.Users{FirstName: "Customer", LastName: "User", Email: "customer@gmail.com", Age: 25, Password: hashedPassword, BirthDay: formattedBirthDay, GenderID: 2})
	}
}
