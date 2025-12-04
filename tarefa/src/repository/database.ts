import path from 'path';
import * as sqlite3 from 'sqlite3';

const dbPath = path.resolve(__dirname, '..', '..', 'database', 'transportadora.db');

const db = new sqlite3.Database(dbPath); 

export default db;