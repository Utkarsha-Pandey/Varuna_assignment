import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
// Make sure to set these environment variables!
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fueleu',
  password: process.env.PASSWORD ,
  port: parseInt(process.env.DB_PORT || '5432'),
});