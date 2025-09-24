package internal

import (
	"bufio"
	"fmt"
	"log"
	"os/exec"
)

func processCamera(cameraId int, rtspUrl string) {
	outUrl := fmt.Sprintf("rtsp://localhost:8554/cam%d", cameraId)

	// ffmpeg command: take input, re-encode, push to MediaMTX
	cmd := exec.Command("ffmpeg",
		"-i", rtspUrl,
		"-vcodec", "libx264", "-preset", "veryfast", "-tune", "zerolatency",
		"-f", "rtsp", outUrl,
	)

	// capture stderr to see ffmpeg logs
	stderr, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		log.Printf("❌ Failed to start ffmpeg: %v\n", err)
		return
	}

	go func() {
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			log.Printf("FFmpeg: %s\n", scanner.Text())
		}
	}()

	log.Printf("📡 FFmpeg started for Camera %d, publishing to %s\n", cameraId, outUrl)

	go func() {
		cmd.Wait()
		log.Printf("⚠️ FFmpeg exited for Camera %d\n", cameraId)
	}()
}

// func processCamera(cameraId int, rtspUrl string) {
// 	log.Printf("🎥 Starting processing for Camera %d (%s)\n", cameraId, rtspUrl)

// 	// Open input RTSP
// 	webcam, err := gocv.OpenVideoCapture(rtspUrl)
// 	if err != nil {
// 		log.Printf("❌ Error opening RTSP stream: %v", err)
// 		return
// 	}
// 	defer webcam.Close()

// 	// Get frame properties
// 	width := int(webcam.Get(gocv.VideoCaptureFrameWidth))
// 	height := int(webcam.Get(gocv.VideoCaptureFrameHeight))
// 	fps := int(webcam.Get(gocv.VideoCaptureFPS))
// 	if fps <= 0 {
// 		fps = 25
// 	}

// 	// Create RTSP writer → publish to MediaMTX
// 	outUrl := fmt.Sprintf("rtsp://localhost:8554/cam%d", cameraId)
// 	// 	// outUrl := fmt.Sprintf("rtsp://localhost:8554/webcam", cameraId)

// 	writer, err := gocv.VideoWriterFile(outUrl, "H264", float64(fps), width, height, true)
// 	if err != nil {
// 		log.Printf("❌ Error creating writer: %v", err)
// 		return
// 	}
// 	defer writer.Close()

// 	// Load Haar Cascade (quick face detection)
// 	classifier := gocv.NewCascadeClassifier()
// 	defer classifier.Close()
// 	if !classifier.Load("haarcascade_frontalface_default.xml") {
// 		log.Println("❌ Error loading cascade")
// 		return
// 	}

// 	img := gocv.NewMat()
// 	defer img.Close()

// 	for {
// 		if ok := webcam.Read(&img); !ok {
// 			log.Println("❌ Cannot read frame")
// 			break
// 		}
// 		if img.Empty() {
// 			continue
// 		}

// 		// Detect faces
// 		rects := classifier.DetectMultiScale(img)
// 		for _, r := range rects {
// 			// Draw bounding box
// 			gocv.Rectangle(&img, r, color.RGBA{255, 0, 0, 0}, 2)
// 			gocv.PutText(&img, "FACE", r.Min, gocv.FontHersheyPlain, 1.2, color.RGBA{0, 255, 0, 0}, 2)
// 		}

// 		// Write frame to MediaMTX
// 		writer.Write(img)

// 		// If faces detected → send alert
// 		if len(rects) > 0 {
// 			sendAlert(cameraId, "", map[string]interface{}{
// 				"faces": len(rects),
// 				"time":  time.Now().String(),
// 			})
// 		}
// 	}
// }