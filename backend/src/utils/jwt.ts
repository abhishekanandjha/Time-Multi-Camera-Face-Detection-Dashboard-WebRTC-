import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export function signJwt(payload: object, expiresIn = '8h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}