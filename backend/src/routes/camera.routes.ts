import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth'
import { prisma } from '../db/prisma'
import axios from 'axios'


const camera = new Hono()

// Apply auth to all routes
camera.use('*', authMiddleware)
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8080'

// Create camera
camera.post('/', async (c) => {
  const body = await c.req.json()
  const { name, rtspUrl, location } = body || {}
  const user = (c as any).user

  if (!name || !rtspUrl) {
    return c.json({ message: 'Name and RTSP URL are required' }, 400)
  }

  const cam = await prisma.camera.create({
    data: {
      name,
      rtspUrl,
      location,
      enabled: true,
      userId: user.id,
    },
  })

  return c.json(cam)
})

// Get all cameras for user
camera.get('/', async (c) => {
  const user = (c as any).user
  const cameras = await prisma.camera.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
  return c.json(cameras)
})

// Update camera
camera.put('/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const user = (c as any).user

  const updated = await prisma.camera.updateMany({
    where: { id: Number(id), userId: user.id },
    data: body,
  })

  if (updated.count === 0) return c.json({ message: 'Camera not found' }, 404)
  return c.json({ message: 'Camera updated successfully' })
})

// Delete camera
camera.delete('/:id', async (c) => {
  const { id } = c.req.param()
  const user = (c as any).user

  const deleted = await prisma.camera.deleteMany({
    where: { id: Number(id), userId: user.id },
  })

  if (deleted.count === 0) return c.json({ message: 'Camera not found' }, 404)
  return c.json({ message: 'Camera deleted successfully' })
})


// Start camera
camera.post('/:id/start', async (c) => {
  const { id } = c.req.param()
  const user = (c as any).user

  // find camera
  const cam = await prisma.camera.findFirst({ where: { id: Number(id), userId: user.id } })
  if (!cam) return c.json({ message: 'Camera not found' }, 404)

  // mark enabled
  await prisma.camera.update({
    where: { id: cam.id },
    data: { enabled: true },
  })

  // notify worker service
  try {
    // await axios.post(`http://worker:8080/start`, { cameraId: cam.id, rtspUrl: cam.rtspUrl })
    await axios.post(`${WORKER_URL}/start`, { cameraId: cam.id, rtspUrl: cam.rtspUrl })
  } catch (err) {
    console.error('Failed to notify worker:', err)
  }

  return c.json({ message: `Camera ${id} started` })
})

// Stop camera
camera.post('/:id/stop', async (c) => {
  const { id } = c.req.param()
  const user = (c as any).user

  const cam = await prisma.camera.findFirst({ where: { id: Number(id), userId: user.id } })
  if (!cam) return c.json({ message: 'Camera not found' }, 404)

  await prisma.camera.update({
    where: { id: cam.id },
    data: { enabled: false },
  })

  try {
    // await axios.post(`http://worker:8080/stop`, { cameraId: cam.id })
    await axios.post(`${WORKER_URL}/stop`, { cameraId: cam.id })
  } catch (err) {
    console.error('Failed to notify worker:', err)
  }

  return c.json({ message: `Camera ${id} stopped` })
})

export default camera