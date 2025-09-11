package services

import (
	"example.com/fitness-backend/entity"
	"example.com/fitness-backend/config"
	"fmt"
	"strings"
)

// CreateTrainer เพิ่มข้อมูลเทรนเนอร์
func CreateTrainer(trainer entity.Trainer) (entity.Trainer, error) {
	fmt.Println("[CreateTrainer] email=", trainer.Email, " passLen=", len(trainer.Password))
	// ตรวจสอบอีเมลซ้ำ
	var count int64
	if err := config.DB().Model(&entity.Trainer{}).Where("email = ?", trainer.Email).Count(&count).Error; err != nil {
		return trainer, err
	}
	if count > 0 {
		return trainer, fmt.Errorf("email already exists")
	}

	// ต้องมีรหัสผ่าน และห้ามว่าง
	if strings.TrimSpace(trainer.Password) == "" {
		return trainer, fmt.Errorf("password required")
	}

	// แฮชรหัสผ่านถ้ามีส่งมา
	if trainer.Password != "" {
		hashed, err := config.HashPassword(trainer.Password)
		if err != nil {
			return trainer, err
		}
		trainer.Password = hashed
	}
	fmt.Println("[CreateTrainer] hashed passLen=", len(trainer.Password))

	err := config.DB().Create(&trainer).Error
	if err != nil {
		return trainer, err
	}

	// ไม่ส่งคืนรหัสผ่าน
	trainer.Password = ""
	return trainer, nil
}

// GetTrainers ดึงข้อมูลเทรนเนอร์ทั้งหมด
func GetTrainers() ([]entity.Trainer, error) {
	var trainers []entity.Trainer
	err := config.DB().Preload("Gender").Find(&trainers).Error
	if err != nil {
		return trainers, err
	}
	// ไม่ส่งคืนรหัสผ่าน
	for i := range trainers {
		trainers[i].Password = ""
	}
	return trainers, nil
}

// GetTrainerByID ดึงข้อมูลเทรนเนอร์ตาม ID
func GetTrainerByID(id uint) (entity.Trainer, error) {
	var trainer entity.Trainer
	err := config.DB().Preload("Gender").First(&trainer, id).Error
	if err != nil {
		return trainer, err
	}
	// ไม่ส่งคืนรหัสผ่าน
	trainer.Password = ""
	return trainer, nil
}

// UpdateTrainer แก้ไขข้อมูลเทรนเนอร์
func UpdateTrainer(id uint, updated entity.Trainer) (entity.Trainer, error) {
	var trainer entity.Trainer
	if err := config.DB().First(&trainer, id).Error; err != nil {
		return trainer, err
	}

	// ถ้ามีส่ง password ใหม่มา ให้แฮชก่อน
	if strings.TrimSpace(updated.Password) != "" {
		hashed, err := config.HashPassword(updated.Password)
		if err != nil {
			return trainer, err
		}
		updated.Password = hashed
	}

	err := config.DB().Model(&trainer).Updates(updated).Error
	if err != nil {
		return trainer, err
	}

	// ไม่ส่งคืนรหัสผ่าน
	trainer.Password = ""
	return trainer, nil
}

// UpdateTrainerImage อัพเดทรูปโปรไฟล์เทรนเนอร์
func UpdateTrainerImage(id uint, imagePath string) (entity.Trainer, error) {
	var trainer entity.Trainer
	if err := config.DB().First(&trainer, id).Error; err != nil {
		return trainer, err
	}
	trainer.ProfileImage = imagePath
	err := config.DB().Save(&trainer).Error
	if err != nil {
		return trainer, err
	}
	// ไม่ส่งคืนรหัสผ่าน
	trainer.Password = ""
	return trainer, nil
}

// DeleteTrainer ลบข้อมูลเทรนเนอร์
func DeleteTrainer(id uint) error {
	return config.DB().Delete(&entity.Trainer{}, id).Error
}
