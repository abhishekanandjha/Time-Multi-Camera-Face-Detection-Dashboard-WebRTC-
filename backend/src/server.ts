import { Hono } from 'hono';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth';

const app = new Hono();

app.route('/api/auth', authRoutes);

// protected route example
app.get('/api/protected', authMiddleware, (c) => {
  const user = (c as any).user;
  return c.json({ message: 'hello protected', user });
});

export default app;