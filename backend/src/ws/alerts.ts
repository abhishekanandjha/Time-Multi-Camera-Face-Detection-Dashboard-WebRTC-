import { WebSocketServer } from 'ws'

let wss: WebSocketServer

export function initWebSocket(server: any) {
//   wss = new WebSocketServer({ server })
  wss = new WebSocketServer({ server, path: '/ws/alerts' })

  console.log('WebSocket server running')

  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected')

    ws.on('close', () => {
      console.log('WebSocket client disconnected')
    })
  })
}

export function broadcastAlert(alert: any) {
  if (!wss) return
  const payload = JSON.stringify({
    event: 'face_detected',
    ...alert,
  })

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload)
    }
  })
}