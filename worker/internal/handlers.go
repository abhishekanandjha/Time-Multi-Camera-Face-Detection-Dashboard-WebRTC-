package internal

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

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

	go simulateCameraStream(req.CameraId, req.RtspUrl)

	c.JSON(http.StatusOK, gin.H{"message": "camera started"})
}

func stopHandler(c *gin.Context) {
	var req StopRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request"})
		return
	}

	// TODO: track running streams, stop them properly
	c.JSON(http.StatusOK, gin.H{"message": "camera stopped"})
}