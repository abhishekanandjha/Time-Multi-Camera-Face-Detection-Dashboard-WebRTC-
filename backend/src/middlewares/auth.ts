import { Hono } from 'hono';
import { Context } from 'hono';
import { verifyJwt } from '../utils/jwt';

export async function authMiddleware(ctx: Context, next: any) {
  const header = ctx.req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return ctx.text('Unauthorized', 401);
  try {
    const payload = verifyJwt(token);
    // attach user info to context (simple)
    (ctx as any).user = payload;
    await next();
  } catch (err) {
    return ctx.text('Invalid token', 401);
  }
}