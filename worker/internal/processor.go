package internal

import (
	"log"
	"time"
)

func simulateCameraStream(cameraId int, rtspUrl string) {
	log.Printf("Starting simulated stream for camera %d (%s)\n", cameraId, rtspUrl)

	// Simulate sending fake alerts every 10s
	for i := 0; i < 5; i++ {
		time.Sleep(10 * time.Second)
		sendAlert(cameraId, "http://example.com/fake-snapshot.png", map[string]interface{}{
			"faces": 1,
		})
	}

	log.Printf("Finished simulated stream for camera %d\n", cameraId)
}