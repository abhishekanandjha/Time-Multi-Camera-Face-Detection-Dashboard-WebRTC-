import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;