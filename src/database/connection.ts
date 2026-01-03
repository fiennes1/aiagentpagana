import Database from 'better-sqlite3';
import { config } from '../config/index.js';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(config.databasePath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

