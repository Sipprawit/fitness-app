package classactivity

import (
    "net/http"

    "github.com/gin-gonic/gin"

    "example.com/fitness-backend/config"
    "example.com/fitness-backend/entity"
)

func GetAll(c *gin.Context) {
    var items []entity.ClassActivity
    db := config.DB()
    result := db.Find(&items)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, items)
}

func Get(c *gin.Context) {
    id := c.Param("id")
    var item entity.ClassActivity
    db := config.DB()
    result := db.First(&item, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
        return
    }
    c.JSON(http.StatusOK, item)
}

func Create(c *gin.Context) {
    var payload entity.ClassActivity
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "bad payload"})
        return
    }
    db := config.DB()
    if err := db.Create(&payload).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, payload)
}

func Update(c *gin.Context) {
    id := c.Param("id")
    var existing entity.ClassActivity
    db := config.DB()
    if err := db.First(&existing, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }
    if err := c.ShouldBindJSON(&existing); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "bad payload"})
        return
    }
    if err := db.Save(&existing).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, existing)
}

func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()
    if tx := db.Delete(&entity.ClassActivity{}, id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }
    c.Status(http.StatusNoContent)
}