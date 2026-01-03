import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  databasePath: process.env.DATABASE_PATH || './database.db',
};

