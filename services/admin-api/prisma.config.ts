import 'dotenv/config';
import { definePrismaConfig } from 'prisma/config';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL no está definida. Copia .env.example a .env antes de usar la CLI de Prisma.',
  );
}

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    db: {
      connection: databaseUrl,
    },
  }),
  skills: {
    agents: ['claude', 'cursor', 'agents', 'devin'],
  },
});
