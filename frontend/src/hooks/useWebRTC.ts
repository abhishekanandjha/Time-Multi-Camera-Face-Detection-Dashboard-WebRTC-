import { useEffect, useRef } from 'react'

export function useWebRTC(streamName: string | null, enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!enabled || !streamName) return   // 🔹 only run when stream is active

    const run = async () => {
      const pc = new RTCPeerConnection()

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0]
        }
      }

      pc.createDataChannel("chat")
      pc.addTransceiver("video", { direction: "sendrecv" })

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      try {
        const resp = await fetch(`http://localhost:8889/${streamName}/whep`, {
          method: "POST",
          body: offer.sdp,
          headers: { "Content-Type": "application/sdp" },
        })

        if (!resp.ok) {
          console.error("❌ WebRTC signaling failed:", await resp.text())
          return
        }

        const answerSdp = await resp.text()
        await pc.setRemoteDescription({ type: "answer", sdp: answerSdp })
      } catch (err) {
        console.error("❌ WebRTC connection error:", err)
      }
    }

    run()
  }, [streamName, enabled])

  return videoRef
}