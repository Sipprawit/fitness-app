package group

import (
	"net/http"
	"strconv"
	"time"

	"example.com/fitness-backend/config" // <-- ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ
	"example.com/fitness-backend/entity" // <-- ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ

	"github.com/gin-gonic/gin"
)

// GetGroups: ดึงรายการกลุ่มทั้งหมด
func GetGroups(c *gin.Context) {
	db := config.DB()
	var groups []entity.WorkoutGroup
	if err := db.Preload("Creator").Preload("Members").Where("deleted_at IS NULL").Find(&groups).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve groups"})
		return
	}

	// สร้าง response พร้อมวันที่เข้าร่วมจากตาราง group_members
	type memberResp struct {
		ID       uint       `json:"id"`
		Name     string     `json:"name"`
		JoinedAt *time.Time `json:"joined_at,omitempty"`
	}
	type groupResp struct {
		ID         uint         `json:"id"`
		Name       string       `json:"name"`
		Goal       string       `json:"goal"`
		MaxMembers uint         `json:"max_members"`
		Status     string       `json:"status"`
		StartDate  time.Time    `json:"start_date"`
		CreatorID  uint         `json:"creator_id"`
		Members    []memberResp `json:"members"`
	}

	// อ่าน created_at ทีเดียวแบบ bulk จาก join table
	type gmRow struct {
		WorkoutGroupID uint       `gorm:"column:workout_group_id"`
		UsersID        uint       `gorm:"column:users_id"`
		CreatedAt      *time.Time `gorm:"column:created_at"`
	}
	groupIDs := make([]uint, 0, len(groups))
	for _, g := range groups {
		groupIDs = append(groupIDs, g.ID)
	}
	joinedAt := map[uint]map[uint]*time.Time{}

	if len(groupIDs) > 0 {
		var rows []gmRow
		db.Table("group_members").
			Select("workout_group_id, users_id, created_at,users_first_name,users_last_name").
			Where("workout_group_id IN ?", groupIDs).
			Find(&rows)
		for _, r := range rows {
			if joinedAt[r.WorkoutGroupID] == nil {
				joinedAt[r.WorkoutGroupID] = map[uint]*time.Time{}
			}
			joinedAt[r.WorkoutGroupID][r.UsersID] = r.CreatedAt
		}
	}

	resp := make([]groupResp, 0, len(groups))
	for _, g := range groups {
		gr := groupResp{
			ID:         g.ID,
			Name:       g.Name,
			Goal:       g.Goal,
			MaxMembers: g.MaxMembers,
			Status:     g.Status,
			StartDate:  g.StartDate,
			CreatorID:  g.CreatorID,
			Members:    make([]memberResp, 0, len(g.Members)),
		}
		for _, m := range g.Members {
			full := m.FirstName
			if m.LastName != "" {
				full = full + " " + m.LastName
			}
			var j *time.Time
			if mMap := joinedAt[g.ID]; mMap != nil {
				j = mMap[m.ID]
			}
			gr.Members = append(gr.Members, memberResp{ID: m.ID, Name: full, JoinedAt: j})
		}
		resp = append(resp, gr)
	}

	c.JSON(http.StatusOK, resp)
}

// CreateGroup: สร้างกลุ่มใหม่
func CreateGroup(c *gin.Context) {
	// รับ payload จาก frontend ซึ่งส่ง startDate เป็น string
	type createGroupPayload struct {
		Name       string `json:"name"`
		Goal       string `json:"goal"`
		MaxMembers uint   `json:"maxMembers"`
		Status     string `json:"status"`
		StartDate  string `json:"startDate"`
	}

	var payload createGroupPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ดึง CreatorID จาก Token ของผู้ใช้ที่ล็อกอินอยู่
	creatorIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	creatorID := creatorIDValue.(uint)

	// แปลง startDate string -> time.Time (รับรูปแบบ YYYY-MM-DD)
	parsedDate, err := time.Parse("2006-01-02", payload.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid startDate format. Use YYYY-MM-DD"})
		return
	}

	group := entity.WorkoutGroup{
		Name:       payload.Name,
		Goal:       payload.Goal,
		MaxMembers: payload.MaxMembers,
		Status:     payload.Status,
		StartDate:  parsedDate,
		CreatorID:  creatorID,
	}

	db := config.DB()
	if err := db.Create(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create group"})
		return
	}
	c.JSON(http.StatusCreated, group)
}

// JoinGroup: เข้าร่วมกลุ่ม
func JoinGroup(c *gin.Context) {
	groupID_str := c.Param("id")
	groupID, _ := strconv.Atoi(groupID_str)
	var group entity.WorkoutGroup
	var user entity.Users

	// ดึง UserID จาก Token
	userID := c.MustGet("user_id").(uint)

	db := config.DB()
	if err := db.Preload("Members").First(&group, groupID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ป้องกันเกินความจุ
	if int(group.MaxMembers) > 0 && len(group.Members) >= int(group.MaxMembers) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กลุ่มเต็มแล้ว"})
		return
	}
	// ป้องกันเข้าซ้ำ
	for _, m := range group.Members {
		if m.ID == user.ID {
			c.JSON(http.StatusBadRequest, gin.H{"error": "คุณเป็นสมาชิกกลุ่มนี้อยู่แล้ว"})
			return
		}
	}

	db.Model(&group).Association("Members").Append(&user)
	// set joined timestamp into join table if column exists
	now := time.Now()
	db.Table("group_members").Where("workout_group_id = ? AND users_id = ?", group.ID, user.ID).Update("created_at", now)
	c.JSON(http.StatusOK, gin.H{"message": "Successfully joined group"})
}

// LeaveGroup: ออกจากกลุ่ม
func LeaveGroup(c *gin.Context) {
	groupID_str := c.Param("id")
	groupID, _ := strconv.Atoi(groupID_str)
	var group entity.WorkoutGroup
	var user entity.Users

	// ดึง UserID จาก Token
	userID := c.MustGet("user_id").(uint)

	db := config.DB()
	if err := db.First(&group, groupID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	db.Model(&group).Association("Members").Delete(&user)
	c.JSON(http.StatusOK, gin.H{"message": "Successfully left group"})
}

// DeleteGroup: ลบกลุ่ม
func DeleteGroup(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var group entity.WorkoutGroup

	if err := db.First(&group, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}
	// TODO: ตรวจสอบสิทธิ์ว่าเป็น Creator

	db.Model(&group).Association("Members").Clear() // ลบสมาชิกทั้งหมดก่อน
	db.Delete(&group)
	c.JSON(http.StatusOK, gin.H{"message": "Group deleted successfully"})
}
