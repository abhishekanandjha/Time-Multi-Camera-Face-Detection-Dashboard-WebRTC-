package internal

import (
	"log"

	"github.com/go-resty/resty/v2"
)

func sendAlert(cameraId int, snapshotUrl string, metadata map[string]interface{}) {
	client := resty.New()

	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]interface{}{
			"cameraId":    cameraId,
			"snapshotUrl": snapshotUrl,
			"metadata":    metadata,
		}).
		Post("http://localhost:4000/api/alerts")

	if err != nil {
		log.Printf("Failed to send alert: %v\n", err)
		return
	}

	log.Printf("Alert sent for camera %d, backend status: %d\n", cameraId, resp.StatusCode())
}