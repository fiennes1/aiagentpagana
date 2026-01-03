import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import type { Message, MessageRole } from '../models/types.js';

interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

function mapRowToMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role as MessageRole,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function createMessage(
  conversationId: string,
  role: MessageRole,
  content: string
): Message {
  const db = getDatabase();
  const id = uuidv4();
  
  const stmt = db.prepare(`
    INSERT INTO messages (id, conversation_id, role, content)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(id, conversationId, role, content);
  
  return findMessageById(id)!;
}

export function findMessageById(id: string): Message | null {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    SELECT id, conversation_id, role, content, created_at
    FROM messages
    WHERE id = ?
  `);
  
  const row = stmt.get(id) as MessageRow | undefined;
  
  if (!row) return null;
  
  return mapRowToMessage(row);
}

export function findMessagesByConversationId(conversationId: string): Message[] {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    SELECT id, conversation_id, role, content, created_at
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `);
  
  const rows = stmt.all(conversationId) as MessageRow[];
  
  return rows.map(mapRowToMessage);
}

