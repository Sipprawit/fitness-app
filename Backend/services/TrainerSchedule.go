package services

import (
    "example.com/fitness-backend/config"
    "example.com/fitness-backend/entity"
    "time"
)

// Create
func CreateTrainerSchedule(schedule entity.TrainerSchedule) (entity.TrainerSchedule, error) {
    err := config.DB().Create(&schedule).Error
    if err != nil {
        return schedule, err
    }
    config.DB().
        Preload("Trainer").
        Preload("Bookings").
        Preload("Bookings.Users").
        First(&schedule, schedule.ID)
    return schedule, nil
}

// Get by ID
func GetScheduleByID(id uint) (entity.TrainerSchedule, error) {
    var schedule entity.TrainerSchedule
    err := config.DB().
        Preload("Trainer").
        Preload("Bookings").
        Preload("Bookings.Users").
        First(&schedule, id).Error
    return schedule, err
}

// Get by Trainer
func GetSchedulesByTrainer(trainerID uint) ([]entity.TrainerSchedule, error) {
    var schedules []entity.TrainerSchedule
    err := config.DB().
        Where("trainer_id = ?", trainerID).
        Preload("Trainer").
        Preload("Bookings").
        Preload("Bookings.Users").
        Find(&schedules).Error
    return schedules, err
}

// Get All
func GetAllSchedules() ([]entity.TrainerSchedule, error) {
    var schedules []entity.TrainerSchedule
    err := config.DB().
        Preload("Trainer").
        Preload("Bookings").
        Preload("Bookings.Users").
        Find(&schedules).Error
    return schedules, err
}

// Update
func UpdateSchedule(id uint, updatedSchedule entity.TrainerSchedule) (entity.TrainerSchedule, error) {
    var schedule entity.TrainerSchedule
    if err := config.DB().First(&schedule, id).Error; err != nil {
        return schedule, err
    }
    err := config.DB().Model(&schedule).Updates(updatedSchedule).Error
    if err != nil {
        return schedule, err
    }
    config.DB().
        Preload("Trainer").
        Preload("Bookings").
        Preload("Bookings.Users").
        First(&schedule, schedule.ID)
    return schedule, nil
}

// Delete
func DeleteSchedule(id uint) error {
    return config.DB().Delete(&entity.TrainerSchedule{}, id).Error
}

// Get schedules by date
func GetTrainerSchedulesByDate(trainerId uint, date time.Time) ([]entity.TrainerSchedule, error) {
    var schedules []entity.TrainerSchedule

    start := date.Truncate(24 * time.Hour)
    end := start.Add(24 * time.Hour)

    err := config.DB().
        Preload("Trainer").
        Preload("Bookings").
        Preload("Bookings.Users").
        Where("trainer_id = ?", trainerId).
        Where("available_date >= ? AND available_date < ?", start, end).
        Find(&schedules).Error

    if err != nil {
        return nil, err
    }

    // อัปเดตสถานะตาม bookings จริง
    for i := range schedules {
        if len(schedules[i].Bookings) > 0 {
            schedules[i].Status = "Booked"
        } else {
            schedules[i].Status = "Available"
        }
    }

    return schedules, nil
}
