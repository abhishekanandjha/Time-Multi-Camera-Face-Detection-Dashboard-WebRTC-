import { prisma } from '../db/prisma';
import bcrypt from 'bcrypt';

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function createUser(username: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { username, password: hashed } });
}

export async function validatePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}