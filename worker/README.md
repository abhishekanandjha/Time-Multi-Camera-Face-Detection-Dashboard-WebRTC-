<!-- for starting go server -->
go mod tidy
go run main.go
<!-- Worker running on port 8080 -->
<!--  -->

<!-- for system -->
<!-- Install system deps (macOS) -->
brew install opencv ffmpeg
<!--  -->


<!-- Run this in the folder where you extracted mediamtx: -->
xattr -d com.apple.quarantine ./mediamtx
chmod +x ./mediamtx

./mediamtx


brew install pkg-config opencv

ffmpeg -re -stream_loop -1 -i ~/Desktop/mediamtx_v1.15.0_darwin_amd64/testvideo.MOV -c copy -f rtsp rtsp://localhost:8554/testinput
now video is uploaded in http://localhost:8889/testinput

<!-- now i can use webcam -->
ffmpeg -f avfoundation -framerate 30 -i "0" \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -f rtsp rtsp://localhost:8554/webcam

http://localhost:8889/webcam/
  <!--  -->
