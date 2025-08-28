import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  views: {
    path: './prisma/views',
  },
});
