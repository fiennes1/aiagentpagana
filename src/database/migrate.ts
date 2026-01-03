import { createTables } from './schema.js';
import { closeDatabase } from './connection.js';

console.log('Executando migracoes...');
createTables();
console.log('Tabelas criadas com sucesso!');
closeDatabase();
console.log('Migracao concluida.');

