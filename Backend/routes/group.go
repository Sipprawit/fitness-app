package routes

import (
	"example.com/fitness-backend/controllers/group"
	"github.com/gin-gonic/gin"
)

func GroupRoutes(r *gin.RouterGroup) {
	// --- Group Routes ---
	r.GET("/groups", group.GetGroups)
	r.POST("/groups", group.CreateGroup)
	r.DELETE("/group/:id", group.DeleteGroup)
	r.POST("/group/:id/join", group.JoinGroup)
	r.DELETE("/group/:id/leave", group.LeaveGroup)
}
