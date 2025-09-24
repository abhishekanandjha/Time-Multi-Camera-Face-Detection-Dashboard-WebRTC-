import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth'
import { prisma } from '../db/prisma'
import { broadcastAlert } from '../ws/alerts'

const alert = new Hono()

// All routes protected
alert.use('*', authMiddleware)

// Worker posts new alert
alert.post('/', async (c) => {
  const body = await c.req.json()
  const { cameraId, snapshotUrl, metadata } = body || {}

  if (!cameraId) return c.json({ message: 'cameraId is required' }, 400)

  // Ensure camera exists
  const camera = await prisma.camera.findUnique({ where: { id: Number(cameraId) } })
  if (!camera) return c.json({ message: 'Camera not found' }, 404)

  const created = await prisma.alert.create({
    data: {
      cameraId: Number(cameraId),
      snapshotUrl,
      metadata,
    },
  })

   broadcastAlert(created)

  return c.json(created)
})

// Fetch alerts (with pagination + filter)
alert.get('/', async (c) => {
  const user = (c as any).user
  const page = Number(c.req.query('page') || 1)
  const limit = Number(c.req.query('limit') || 10)
  const cameraId = c.req.query('cameraId')

  const skip = (page - 1) * limit

  // Only return alerts for cameras owned by user
  const where: any = {}
  if (cameraId) where.cameraId = Number(cameraId)

  const [alerts, total] = await Promise.all([
    prisma.alert.findMany({
      where: {
        ...where,
        camera: { userId: user.id },
      },
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' },
    }),
    prisma.alert.count({
      where: {
        ...where,
        camera: { userId: user.id },
      },
    }),
  ])

  return c.json({
    data: alerts,
    pagination: {
      page,
      limit,
      total,
    },
  })
})

export default alert