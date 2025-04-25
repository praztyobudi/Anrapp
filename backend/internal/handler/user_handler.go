package handler

import (
	"backend/internal/dto"
	"backend/internal/usecase"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserUsecase usecase.UserUsecase
}

func NewUserHandler(uc usecase.UserUsecase) *UserHandler {
	return &UserHandler{UserUsecase: uc}
}

func (h *UserHandler) GetUserByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"meta": gin.H{
				"message": "ID harus berupa angka",
				"code":    http.StatusBadRequest,
				"status":  "error",
			},
			"data": nil,
		})
		return
	}

	user, err := h.UserUsecase.GetByID(id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" || err.Error() == "user tidak ditemukan" {
			c.JSON(http.StatusNotFound, gin.H{
				"meta": gin.H{
					"message": "User tidak ditemukan",
					"code":    http.StatusNotFound,
					"status":  "error",
				},
				"data": nil,
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"meta": gin.H{
					"message": "Gagal mengambil user: " + err.Error(),
					"code":    http.StatusInternalServerError,
					"status":  "error",
				},
				"data": nil,
			})
		}
		return
	}

	// Kalau berhasil
	c.JSON(http.StatusOK, gin.H{
		"meta": gin.H{
			"message": "Berhasil mendapatkan user",
			"code":    http.StatusOK,
			"status":  "success",
		},
		"data": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"name":     user.Name,
			"department": gin.H{
				"department": user.Department.Department,
			},
		},
	})
}

func (h *UserHandler) GetAll(c *gin.Context) {
	users, err := h.UserUsecase.GetUsers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) Update(c *gin.Context) {
	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	if err := h.UserUsecase.Update(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

// handler/user_handler.go
func (h *UserHandler) Delete(c *gin.Context) {
	var req struct {
		ID int `json:"id"`
	}

	// Bind the JSON body to the struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	// Call the usecase to delete the user by ID
	if err := h.UserUsecase.Delete(c.Request.Context(), req.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Send success response
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
