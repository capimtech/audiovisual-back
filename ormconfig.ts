/* eslint-disable @typescript-eslint/no-var-requires */
const { DataSource } = require('typeorm');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [path.join(__dirname, '/src/migrations/**/*{.ts,.js}')],
  cli: {
    migrationsDir: path.join(__dirname, '/src/migrations'),
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
});

module.exports = {
  connectionSource,
};
