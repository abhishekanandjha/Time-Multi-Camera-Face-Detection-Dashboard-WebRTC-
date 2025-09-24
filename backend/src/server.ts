import { Hono } from 'hono';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth';
import cameraRoutes from './routes/camera.routes';

const app = new Hono();

app.route('/api/auth', authRoutes);
app.route('/api/cameras', cameraRoutes)


// protected route example
app.get('/api/protected', authMiddleware, (c) => {
  const user = (c as any).user;
  return c.json({ message: 'hello protected', user });
});

export default app;