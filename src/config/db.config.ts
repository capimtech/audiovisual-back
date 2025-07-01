import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: __dirname + '/../migrations',
    },
    ssl: {
      rejectUnauthorized: false,
    },
    extra: {
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
    retryAttempts: 5,
    retryDelay: 3000,
  };
});
