import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import type { Conversation, ConversationStatus, Sector } from '../models/types.js';

interface ConversationRow {
  id: string;
  status: string;
  sector: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    status: row.status as ConversationStatus,
    sector: row.sector as Sector | null,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createConversation(): Conversation {
  const db = getDatabase();
  const id = uuidv4();
  
  const stmt = db.prepare(`
    INSERT INTO conversations (id, status)
    VALUES (?, 'active')
  `);
  
  stmt.run(id);
  
  return findConversationById(id)!;
}

export function findConversationById(id: string): Conversation | null {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    SELECT id, status, sector, summary, created_at, updated_at
    FROM conversations
    WHERE id = ?
  `);
  
  const row = stmt.get(id) as ConversationRow | undefined;
  
  if (!row) return null;
  
  return mapRowToConversation(row);
}

export function updateConversation(
  id: string,
  data: { status?: ConversationStatus; sector?: Sector; summary?: string }
): Conversation | null {
  const db = getDatabase();
  
  const updates: string[] = ["updated_at = datetime('now')"];
  const values: (string | null)[] = [];
  
  if (data.status !== undefined) {
    updates.push('status = ?');
    values.push(data.status);
  }
  
  if (data.sector !== undefined) {
    updates.push('sector = ?');
    values.push(data.sector);
  }
  
  if (data.summary !== undefined) {
    updates.push('summary = ?');
    values.push(data.summary);
  }
  
  values.push(id);
  
  const stmt = db.prepare(`
    UPDATE conversations
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  
  stmt.run(...values);
  
  return findConversationById(id);
}

export function findAllConversations(): Conversation[] {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    SELECT id, status, sector, summary, created_at, updated_at
    FROM conversations
    ORDER BY updated_at DESC
  `);
  
  const rows = stmt.all() as ConversationRow[];
  
  return rows.map(mapRowToConversation);
}

