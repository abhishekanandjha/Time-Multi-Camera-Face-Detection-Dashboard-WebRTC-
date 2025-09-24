package internal

import (
	"github.com/gin-gonic/gin"
	"log"
)

func StartServer() {
	r := gin.Default()

	// Endpoints
	r.POST("/start", startHandler)
	r.POST("/stop", stopHandler)

	log.Println("Worker running on port 8080")
	r.Run(":8080")
}