package main

import (
	"backend/config"
	"backend/internal/handler"
	repository "backend/internal/repo"
	"backend/internal/usecase"
	"backend/route"
	"time"

	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db := config.ConnectDB()
	defer db.Close()

	r := gin.Default()

	// Tambah middleware CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://app.prazelab.my.id"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	repo := repository.NewUserRepository(db)
	uc := usecase.NewUserUsecase(repo)
	auth := handler.NewAuthHandler(uc)
	user := handler.NewUserHandler(uc)

	route.Setup(r, auth, user)

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
