import { Hono } from 'hono';
// import { json } from 'hono/json';
import { findUserByUsername, validatePassword } from '../services/auth.service';
import { signJwt } from '../utils/jwt';

const auth = new Hono();

auth.post('/login', async (c) => {
  const body = await c.req.json();
  const { username, password } = body || {};
  if (!username || !password) return c.json({ message: 'username + password required' }, 400);

  const user = await findUserByUsername(username);
  if (!user) return c.json({ message: 'Invalid credentials' }, 401);

  const ok = await validatePassword(password, user.password);
  if (!ok) return c.json({ message: 'Invalid credentials' }, 401);

  const token = signJwt({ id: user.id, username: user.username });
  return c.json({ token, user: { id: user.id, username: user.username } });
});

export default auth;