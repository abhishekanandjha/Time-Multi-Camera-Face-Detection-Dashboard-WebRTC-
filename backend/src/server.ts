import { Hono } from 'hono';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth';
import cameraRoutes from './routes/camera.routes';
import alertRoutes from './routes/alert.routes';
import { cors } from 'hono/cors'

const app = new Hono();
app.use('*', cors())


app.route('/api/auth', authRoutes);
app.route('/api/cameras', cameraRoutes)
app.route('/api/alerts', alertRoutes)



// protected route example
app.get('/api/protected', authMiddleware, (c) => {
  const user = (c as any).user;
  return c.json({ message: 'hello protected', user });
});

export default app;