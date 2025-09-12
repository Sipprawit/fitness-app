package packagemember

import (
	"net/http"

	"example.com/fitness-backend/config"
	"example.com/fitness-backend/entity"
	"github.com/gin-gonic/gin"
)

// GetAll ฟังก์ชันสำหรับดึงข้อมูล PackageMember ทั้งหมด
func GetAll(c *gin.Context) {
	var packageMembers []entity.PackageMember
	config.DB().Preload("Username").Preload("Package").Find(&packageMembers)
	c.JSON(http.StatusOK, gin.H{"data": packageMembers})
}

// Get ฟังก์ชันสำหรับดึงข้อมูล PackageMember ตาม ID
func Get(c *gin.Context) {
	var packageMember entity.PackageMember
	id := c.Param("id")

	if err := config.DB().Preload("Username").Preload("Package").Where("id = ?", id).First(&packageMember).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PackageMember not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": packageMember})
}

// GetByUserID ฟังก์ชันสำหรับดึงข้อมูล PackageMember ตาม UserID
func GetByUserID(c *gin.Context) {
	var packageMembers []entity.PackageMember
	userID := c.Param("user_id")

	config.DB().Preload("Username").Preload("Package").Where("user_id = ?", userID).Find(&packageMembers)
	c.JSON(http.StatusOK, gin.H{"data": packageMembers})
}

// Create ฟังก์ชันสำหรับสร้าง PackageMember ใหม่
func Create(c *gin.Context) {
	var packageMember entity.PackageMember
	if err := c.ShouldBindJSON(&packageMember); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า user_id และ package_id ซ้ำกันหรือไม่
	var existingPackageMember entity.PackageMember
	if err := config.DB().Where("user_id = ? AND package_id = ?", packageMember.UserID, packageMember.PackageID).First(&existingPackageMember).Error; err == nil {
		// พบข้อมูลซ้ำ
		c.JSON(http.StatusOK, gin.H{
			"data":    packageMember,
			"error":   "duplicate user_id and package_id",
			"message": "User already has this package",
		})
		return
	}

	// สร้างข้อมูลใหม่
	if err := config.DB().Create(&packageMember).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": packageMember})
}

// Update ฟังก์ชันสำหรับอัปเดตข้อมูล PackageMember
func Update(c *gin.Context) {
	var packageMember entity.PackageMember
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&packageMember).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PackageMember not found!"})
		return
	}

	if err := c.ShouldBindJSON(&packageMember); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB().Save(&packageMember)
	c.JSON(http.StatusOK, gin.H{"data": packageMember})
}

// Delete ฟังก์ชันสำหรับลบข้อมูล PackageMember
func Delete(c *gin.Context) {
	var packageMember entity.PackageMember
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&packageMember).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PackageMember not found!"})
		return
	}

	config.DB().Delete(&packageMember)
	c.JSON(http.StatusOK, gin.H{"data": "PackageMember deleted successfully"})
}

// DeleteByUserID ฟังก์ชันสำหรับลบข้อมูล PackageMember ตาม UserID
func DeleteByUserID(c *gin.Context) {
	var packageMembers []entity.PackageMember
	userID := c.Param("user_id")

	// หาข้อมูล PackageMember ที่มี user_id ตรงกัน (รวม soft deleted)
	if err := config.DB().Unscoped().Where("user_id = ?", userID).Find(&packageMembers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PackageMember not found!"})
		return
	}

	// ถ้าไม่พบข้อมูล
	if len(packageMembers) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No package found for this user!"})
		return
	}

	// ลบข้อมูลทั้งหมดที่มี user_id ตรงกัน (hard delete)
	result := config.DB().Unscoped().Where("user_id = ?", userID).Delete(&entity.PackageMember{})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete package member"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "PackageMember deleted successfully", "deleted_count": result.RowsAffected})
}

// UpdateByUserID ฟังก์ชันสำหรับอัปเดต package_id ของ PackageMember ตาม UserID
func UpdateByUserID(c *gin.Context) {
	var packageMember entity.PackageMember
	userID := c.Param("user_id")

	// หาข้อมูล PackageMember ที่มี user_id ตรงกัน
	if err := config.DB().Where("user_id = ?", userID).First(&packageMember).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "PackageMember not found!"})
		return
	}

	// อัปเดต package_id
	var updateData struct {
		PackageID uint `json:"package_id"`
	}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า user_id และ package_id ซ้ำกันหรือไม่
	var existingPackageMember entity.PackageMember
	if err := config.DB().Where("user_id = ? AND package_id = ?", userID, updateData.PackageID).First(&existingPackageMember).Error; err == nil {
		// พบข้อมูลซ้ำ
		c.JSON(http.StatusOK, gin.H{
			"data":    packageMember,
			"error":   "duplicate user_id and package_id",
			"message": "User already has this package",
		})
		return
	}

	// อัปเดตข้อมูล
	packageMember.PackageID = updateData.PackageID
	if err := config.DB().Save(&packageMember).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update package member"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "PackageMember updated successfully", "package_member": packageMember})
}
