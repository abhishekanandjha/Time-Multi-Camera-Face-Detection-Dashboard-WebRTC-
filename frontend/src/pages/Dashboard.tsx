
import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useWebRTC } from '../hooks/useWebRTC'


interface Camera {
    id: number;
    name: string;
    location: string;
    enabled: boolean;
}

interface Alert {
    id: number;
    cameraId: number;
    timestamp: string;
    snapshotUrl?: string;
    metadata?: any;
}

// 🔹 Sub-component for each camera card
const CameraCard: React.FC<{
    cam: Camera
    startCamera: (id: number) => void
    stopCamera: (id: number) => void
}> = ({ cam, startCamera, stopCamera }) => {
    const videoRef = useWebRTC(`cam${cam.id}`, cam.enabled)

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{cam.name}</Typography>
                <Typography variant="body2">{cam.location}</Typography>

                {/* WebRTC video */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', borderRadius: 8 }}
                />

                {cam.enabled ? (
                    <Button
                        onClick={() => stopCamera(cam.id)}
                        sx={{ mt: 1 }}
                        color="error"
                        variant="contained"
                    >
                        Stop Stream
                    </Button>
                ) : (
                    <Button
                        onClick={() => startCamera(cam.id)}
                        sx={{ mt: 1 }}
                        variant="contained"
                    >
                        Start Stream
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
const Dashboard: React.FC = () => {
    const [cameras, setCameras] = useState<Camera[]>([])
    const [alerts, setAlerts] = useState<Alert[]>([])

    const loadCameras = async () => {
        const res = await api.get('/cameras')
        setCameras(res.data)
    }

    const loadAlerts = async () => {
        const res = await api.get('/alerts?limit=10')
        setAlerts(res.data.data)
    }

    const startCamera = async (id: number) => {
        await api.post(`/cameras/${id}/start`)
        loadCameras()
    }

    const stopCamera = async (id: number) => {
        await api.post(`/cameras/${id}/stop`)
        loadCameras()
    }

    useEffect(() => {
        loadCameras()
        loadAlerts()

        // setup websocket for real-time alerts
        const ws = new WebSocket('ws://localhost:4000/ws/alerts')
        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data)
            if (data.event === 'face_detected') {
                setAlerts((prev) => [data, ...prev]) // prepend new alert
            }
        }
        return () => ws.close()
    }, [])

    return (
        <Box p={2}>
            <Typography variant="h4" mb={2}>
                Dashboard
            </Typography>
            <Grid container spacing={2}>
                {cameras.map((cam) => (
                    <Grid item xs={12} md={6} lg={4} key={cam.id}>
                        <CameraCard
                            cam={cam}
                            startCamera={startCamera}
                            stopCamera={stopCamera}
                        />
                    </Grid>
                ))}
            </Grid>

            <Box mt={4}>
                <Typography variant="h5" mb={2}>
                    Recent Alerts
                </Typography>
                {alerts.map((alert) => (
                    <Card key={alert.id} sx={{ mb: 1 }}>
                        <CardContent>
                            <Typography variant="body2">
                                Camera {alert.cameraId} → {alert.timestamp}
                            </Typography>
                            {alert.snapshotUrl && (
                                <img
                                    src={alert.snapshotUrl}
                                    alt="snapshot"
                                    style={{
                                        width: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    )

    // return (
    //     <Box p={2}>
    //         <Typography variant="h4" mb={2}>Dashboard</Typography>
    //         <Grid container spacing={2}>
    //             {cameras.map((cam) => (
    //                 <Grid item xs={12} md={6} lg={4} key={cam.id}>
    //                     <Card>
    //                         <CardContent>
    //                             <Typography variant="h6">{cam.name}</Typography>
    //                             <Typography variant="body2">{cam.location}</Typography>
    //                             {cam.enabled ? (
    //                                 <Button
    //                                     size="small"
    //                                     variant="contained"
    //                                     color="error"
    //                                     onClick={() => stopCamera(cam.id)}
    //                                     sx={{ mt: 1 }}
    //                                 >
    //                                     Stop Stream
    //                                 </Button>
    //                             ) : (
    //                                 <Button
    //                                     size="small"
    //                                     variant="contained"
    //                                     onClick={() => startCamera(cam.id)}
    //                                     sx={{ mt: 1 }}
    //                                 >
    //                                     Start Stream
    //                                 </Button>
    //                             )}
    //                         </CardContent>
    //                     </Card>
    //                 </Grid>
    //             ))}
    //         </Grid>

    //         <Box mt={4}>
    //             <Typography variant="h5" mb={2}>Recent Alerts</Typography>
    //             {alerts.map((alert) => (
    //                 <Card key={alert.id} sx={{ mb: 1 }}>
    //                     <CardContent>
    //                         <Typography variant="body2">
    //                             Camera {alert.cameraId} → {alert.timestamp}
    //                         </Typography>
    //                         {alert.snapshotUrl && (
    //                             <img src={alert.snapshotUrl} alt="snapshot" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
    //                         )}
    //                     </CardContent>
    //                 </Card>
    //             ))}
    //         </Box>
    //     </Box>
    // )
}

export default Dashboard