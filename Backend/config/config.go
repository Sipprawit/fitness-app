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
		&entity.ClassActivity{},
		&entity.Equipment{},
		&entity.Facility{},
		&entity.Users{},
		&entity.Trainer{},
		&entity.Admin{},
		&entity.Health{},
		&entity.Activity{},
		&entity.Nutrition{},
		&entity.Meal{},
		&entity.TrainerSchedule{},
		&entity.TrainBooking{},
		&entity.ClassBooking{},
		&entity.Review{},
		&entity.WorkoutGroup{},

		&entity.Package{},
		&entity.Services{},
		&entity.PackageMember{},

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

	// Seed ClassActivity if empty
	var existingClass entity.ClassActivity
	if err := db.First(&existingClass).Error; err != nil && err == gorm.ErrRecordNotFound {
		classes := []entity.ClassActivity{
			{Name: "Yoga Beginner", Description: "คลาสโยคะสำหรับผู้เริ่มต้น", Date: time.Now().Format("2006-01-02"), StartTime: "13:00", EndTime: "14:00", Location: "Yoga Room", Capacity: 20, ImageURL: ""},
			{Name: "HIIT Training", Description: "คลาสคาร์ดิโอความเข้มข้นสูง", Date: time.Now().Format("2006-01-02"), StartTime: "15:00", EndTime: "15:45", Location: "Weight Zone", Capacity: 12, ImageURL: ""},
		}
		for _, c := range classes {
			db.Create(&c)
		}
	}

	// Seed Equipment if empty
	var existingEquipment entity.Equipment
	if err := db.First(&existingEquipment).Error; err != nil && err == gorm.ErrRecordNotFound {
		equipments := []entity.Equipment{
			{Name: "ลู่วิ่ง A", Type: "คาร์ดิโอ", Zone: "โซนคาร์ดิโอ", Status: "Available", Condition: "Good", UsageHours: 120},
			{Name: "ชุดดัมเบล", Type: "เวทเทรนนิ่ง", Zone: "โซนเวท", Status: "Available", Condition: "Good", UsageHours: 300},
		}
		for _, e := range equipments {
			db.Create(&e)
		}
	}

	// Seed Facility if empty
	var existingFacility entity.Facility
	if err := db.First(&existingFacility).Error; err != nil && err == gorm.ErrRecordNotFound {
		facilities := []entity.Facility{
			{Name: "ห้องโยคะ", Zone: "A", Status: "Open", Capacity: 20},
			{Name: "โซนเวท", Zone: "B", Status: "Open", Capacity: 30},
		}
		for _, f := range facilities {
			db.Create(&f)
		}
	}
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

	// Services Data
	services := []entity.Services{
		{
			Service: "ไม่เลือก",
			Detail:  "-",
		},
		{
			Service: "บริการห้องซาวน่า",
			Detail:  "ใช้บริการห้องซาวน่าฟรี",
		},
		{
			Service: "บริการสระว่ายน้ำ",
			Detail:  "ใช้บริการสระว่ายน้ำฟรี",
		},
	}

	// Create services if they don't exist
	for _, service := range services {
		var existingService entity.Services
		if tx := db.Where("service = ?", service.Service).First(&existingService); tx.RowsAffected == 0 {
			db.Create(&service)
		}
	}

	// Package Data
	packages := []entity.Package{
		{
			PackageName: "ฟิตตึงเปรี๊ยะ",
			Type:        "รายเดือน",
			Detail:      "เข้าใช้บริการฟิตเนสฟรีตลอดเดือน",
			ServiceID:   1,
			Price:       1290,
		},
		{
			PackageName: "ฟิตปึ๋งปั๋ง",
			Type:        "รายปี",
			Detail:      "เข้าใช้บริการฟิตเนสฟรีตลอดปี",
			ServiceID:   1,
			Price:       10000,
		},
		{
			PackageName: "ฟิตฮึดฮัด",
			Type:        "รายเดือน",
			Detail:      "เข้าใช้บริการฟิตเนสฟรีตลอดเดือน",
			ServiceID:   2,
			Price:       1890,
		},
		{
			PackageName: "ฟิตฮึฮึ",
			Type:        "รายปี",
			Detail:      "เข้าใช้บริการฟิตเนสฟรีตลอดปี",
			ServiceID:   2,
			Price:       16000,
		},
		{
			PackageName: "ฟิตปุ๋งปุ๋ง",
			Type:        "รายเดือน",
			Detail:      "เข้าใช้บริการฟิตเนสฟรีตลอดเดือน",
			ServiceID:   3,
			Price:       1390,
		},
		{
			PackageName: "ฟิตบุ๋งบุ๋ง",
			Type:        "รายปี",
			Detail:      "เข้าใช้บริการฟิตเนสฟรีตลอดปี",
			ServiceID:   3,
			Price:       12000,
		},
	}

	// Create packages if they don't exist
	for _, pkg := range packages {
		var existingPackage entity.Package
		if tx := db.Where("package_name = ? AND type = ?", pkg.PackageName, pkg.Type).First(&existingPackage); tx.RowsAffected == 0 {
			db.Create(&pkg)
		}
	}

	// Seed Reviews if empty
	var existingReview entity.Review
	if err := db.First(&existingReview).Error; err != nil && err == gorm.ErrRecordNotFound {

		// ดึงข้อมูลคลาสและเทรนเนอร์ที่สร้างไว้
		var classActivity entity.ClassActivity
		var trainer entity.Trainer
		var user entity.Users

		db.First(&classActivity)
		db.First(&trainer)
		db.First(&user)

		// สร้างรีวิวสำหรับคลาส
		reviews := []entity.Review{
			{
				Rating:         5,
				Comment:        "คลาสโยคะดีมาก ได้ผ่อนคลายและยืดหยุ่นร่างกาย",
				UserID:         user.ID,
				ReviewableID:   classActivity.ID,
				ReviewableType: "classes",
			},
			{
				Rating:         4,
				Comment:        "เทรนเนอร์สอนดีมาก มีเทคนิคที่เข้าใจง่าย",
				UserID:         user.ID,
				ReviewableID:   trainer.ID,
				ReviewableType: "trainers",
			},
		}

		for _, review := range reviews {
			db.Create(&review)
		}
	}

	// Try to add created_at column for group_members join table (ignore error if exists)
	// ตรวจสอบว่าคอลัมน์มีอยู่แล้วหรือไม่ก่อนเพิ่ม
	var columnExists bool
	db.Raw("SELECT COUNT(*) > 0 FROM pragma_table_info('group_members') WHERE name = 'created_at'").Scan(&columnExists)
	if !columnExists {
		_ = db.Exec("ALTER TABLE group_members ADD COLUMN created_at DATETIME").Error // ignore error
	}
}
