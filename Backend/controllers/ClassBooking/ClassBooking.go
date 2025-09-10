package controllers

import (
    "github.com/gofiber/fiber/v2"
    "gorm.io/gorm"
    "your_project/entity" // ตรวจสอบว่า path นี้ถูกต้อง
    "your_project/database" // สมมติว่านี่คือ path ที่เก็บ database connection
)

// BookClass จัดการการจองคลาส
// ฟังก์ชันนี้จะรับข้อมูล class_id และ user_id จาก body ของ request เพื่อทำการจอง
func BookClass(c *fiber.Ctx) error {
    db := database.DB // ดึง database connection จาก package database

    // ตัวอย่างการรับ userId และ classId จาก request body
    var bookingData struct {
        UserID  uint `json:"user_id"`
        ClassID uint `json:"class_id"`
    }

    if err := c.BodyParser(&bookingData); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
    }

    // 1. ตรวจสอบว่า ClassActivity ที่ต้องการจองมีอยู่จริงหรือไม่
    var class entity.ClassActivity
    if err := db.First(&class, bookingData.ClassID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Class not found"})
    }

    // 2. ตรวจสอบจำนวนผู้เข้าร่วมปัจจุบันโดยนับจาก ClassBooking ที่มี class_id เดียวกัน
    var currentParticipants int64
    db.Model(&entity.ClassBooking{}).Where("class_id = ?", bookingData.ClassID).Count(&currentParticipants)

    // 3. ตรวจสอบว่าคลาสเต็มหรือยังโดยเทียบกับจำนวนผู้เข้าร่วมสูงสุด
    if int(currentParticipants) >= class.MaxParticipants {
        return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Class is full"})
    }

    // 4. ตรวจสอบว่าผู้ใช้เคยจองคลาสนี้ไปแล้วหรือไม่
    var existingBooking entity.ClassBooking
    if err := db.Where("users_id = ? AND class_id = ?", bookingData.UserID, bookingData.ClassID).First(&existingBooking).Error; err == nil {
        return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "User has already booked this class"})
    }

    // 5. สร้างการจองใหม่ในฐานข้อมูล
    newBooking := entity.ClassBooking{
        BookingStatus: "Confirmed", // กำหนดสถานะเริ่มต้นเป็นการยืนยันแล้ว
        ClassID:       &bookingData.ClassID,
        usersID:       bookingData.UserID,
    }

    if err := db.Create(&newBooking).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create booking"})
    }

    // 6. ส่ง response ที่สำเร็จกลับไป
    return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Class booked successfully", "booking": newBooking})
}

// GetUserBookings จัดการการดึงข้อมูลการจองทั้งหมดของผู้ใช้
// ฟังก์ชันนี้จะรับ userId จาก URL parameter และดึงข้อมูลการจองทั้งหมดที่เกี่ยวข้อง
func GetUserBookings(c *fiber.Ctx) error {
    db := database.DB

    // รับ userId จาก URL parameter
    userID, err := c.ParamsInt("userId")
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
    }

    var bookings []entity.ClassBooking
    // ใช้ Preload("ClassActivity") เพื่อดึงข้อมูลคลาสที่เกี่ยวข้องมาพร้อมกัน
    if err := db.Where("users_id = ?", userID).Preload("ClassActivity").Find(&bookings).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No bookings found for this user"})
    }

    return c.Status(fiber.StatusOK).JSON(bookings)
}
