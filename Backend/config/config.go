package config

import (
	"fmt"
	"time"

	"example.com/fitness-backend/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"golang.org/x/crypto/bcrypt"
)

// เพิ่มตัวแปร SecretKey ที่สามารถเข้าถึงได้จากภายนอก
var SecretKey string = "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx"

var db *gorm.DB

// HashPassword เป็น function สำหรับการแปลง password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash เป็น function สำหรับ check password ที่ hash แล้ว ว่าตรงกันหรือไม่
func CheckPasswordHash(password, hash []byte) bool {
	err := bcrypt.CompareHashAndPassword(hash, password)
	return err == nil
}

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	// AutoMigrate models
	db.AutoMigrate(
		&entity.Users{},
		&entity.Genders{},
	)

	// Gender Data
	GenderMale := entity.Genders{Gender: "Male"}
	GenderFemale := entity.Genders{Gender: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})

	// Create a default password and birthday for all test users
	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")
	formattedBirthDay := BirthDay.Format("2006-01-02")

	// Users to be created or updated
	users := []entity.Users{
		{
			FirstName: "Admin",
			LastName: "User",
			Email:"admin@gmail.com",
			Age: 35,
			Password: hashedPassword,
			BirthDay: formattedBirthDay,
			GenderID:1,
			Actor: "admin",
		},
		{
			FirstName: "Trainer",
			LastName: "User",
			Email: "trainer@gmail.com",
			Age: 28,
			Password: hashedPassword,
			BirthDay: formattedBirthDay,
			GenderID: 1,
			Actor: "trainer",
		},
		{
			FirstName: "Customer",
			LastName: "User",
			Email: "customer@gmail.com",
			Age: 25,
			Password: hashedPassword,
			BirthDay: formattedBirthDay,
			GenderID: 2,
			Actor: "customer",
		},
	}

	// Loop through users and update their passwords to a fresh hash every time
	for _, user := range users {
		var existingUser entity.Users
		// First, check if the user already exists
		if tx := db.Where("email = ?", user.Email).First(&existingUser); tx.RowsAffected > 0 {
			// If the user exists, update their password hash and other details
			db.Model(&existingUser).Updates(map[string]interface{}{
				"password": user.Password,
				"actor": user.Actor,
			})
		} else {
			// If the user does not exist, create a new one
			db.Create(&user)
		}
	}
}