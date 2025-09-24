package internal

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

var activeStreams = make(map[int]bool)
var mu sync.Mutex

type StartRequest struct {
	CameraId int    `json:"cameraId"`
	RtspUrl  string `json:"rtspUrl"`
}

type StopRequest struct {
	CameraId int `json:"cameraId"`
}

func startHandler(c *gin.Context) {
	var req StartRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request"})
		return
	}

	mu.Lock()
	if activeStreams[req.CameraId] {
		mu.Unlock()
		c.JSON(http.StatusConflict, gin.H{"message": "already running"})
		return
	}
	activeStreams[req.CameraId] = true
	mu.Unlock()

	go processCamera(req.CameraId, req.RtspUrl)

	c.JSON(http.StatusOK, gin.H{"message": "camera started"})
}

func stopHandler(c *gin.Context) {
	var req StopRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request"})
		return
	}

	mu.Lock()
	delete(activeStreams, req.CameraId)
	mu.Unlock()

	c.JSON(http.StatusOK, gin.H{"message": "camera stopped"})
}