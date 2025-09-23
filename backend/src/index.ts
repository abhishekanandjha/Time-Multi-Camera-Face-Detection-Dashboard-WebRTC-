// src/index.ts
import app from './server';
import { PORT } from './config/env';
import { prisma } from './db/prisma';
import { serve } from '@hono/node-server';

const start = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to DB');
  } catch (err) {
    console.error('DB connect error', err);
    process.exit(1);
  }

  serve({ fetch: app.fetch, port: PORT });
  console.log(`🚀 Server running on http://localhost:${PORT}`);
};

start();