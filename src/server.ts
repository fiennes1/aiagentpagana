import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { createTables } from './database/schema.js';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

createTables();

app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
  console.log(`Health check: http://localhost:${config.port}/health`);
  console.log(`API: http://localhost:${config.port}/api`);
});

