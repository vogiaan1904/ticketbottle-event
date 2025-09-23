import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();
export default defineConfig({
  schema: './prisma/schema',
  migrations: {
    path: './prisma/migrations',
  },
  views: {
    path: './prisma/views',
  },
});
