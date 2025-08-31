import { Pool } from 'pg';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем тип базы данных
const isProduction = process.env.NODE_ENV === 'production';
const usePostgres = isProduction && process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://');

let postgresPool: Pool | null = null;
let sqliteDb: sqlite3.Database | null = null;

// Инициализация PostgreSQL
if (usePostgres) {
  postgresPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  postgresPool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
    process.exit(-1);
  });
}

// Инициализация SQLite
if (!usePostgres) {
  const dbPath = path.join(__dirname, '../../database/bailanysta.db');
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('🔧 Connected to SQLite database (development mode)');
    }
  });

  // Enable foreign keys
  sqliteDb.run('PRAGMA foreign_keys = ON');
}

// Проверка соединения
export const testConnection = async (): Promise<boolean> => {
  if (usePostgres && postgresPool) {
    try {
      const client = await postgresPool.connect();
      await client.query('SELECT NOW()');
      client.release();
      console.log('✅ Connected to PostgreSQL database (production mode)');
      return true;
    } catch (error) {
      console.error('❌ Error connecting to PostgreSQL:', error);
      return false;
    }
  } else if (sqliteDb) {
    console.log('🔧 Using SQLite database (development mode)');
    return true;
  }
  return false;
};

// Промис-обертки для SQLite
const sqliteGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!sqliteDb) {
      reject(new Error('SQLite database not initialized'));
      return;
    }
    sqliteDb.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const sqliteAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!sqliteDb) {
      reject(new Error('SQLite database not initialized'));
      return;
    }
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const sqliteRun = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!sqliteDb) {
      reject(new Error('SQLite database not initialized'));
      return;
    }
    sqliteDb.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Промис-обертки для PostgreSQL
const postgresGet = async (sql: string, params: any[] = []): Promise<any> => {
  if (!postgresPool) {
    throw new Error('PostgreSQL pool not initialized');
  }
  const client = await postgresPool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

const postgresAll = async (sql: string, params: any[] = []): Promise<any[]> => {
  if (!postgresPool) {
    throw new Error('PostgreSQL pool not initialized');
  }
  const client = await postgresPool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
};

const postgresRun = async (sql: string, params: any[] = []): Promise<any> => {
  if (!postgresPool) {
    throw new Error('PostgreSQL pool not initialized');
  }
  const client = await postgresPool.connect();
  try {
    const result = await client.query(sql, params);
    return {
      id: result.rows[0]?.id,
      changes: result.rowCount
    };
  } finally {
    client.release();
  }
};

// Экспортируем функции в зависимости от типа базы данных
export const dbGet = usePostgres ? postgresGet : sqliteGet;
export const dbAll = usePostgres ? postgresAll : sqliteAll;
export const dbRun = usePostgres ? postgresRun : sqliteRun;

// Закрытие соединений
export const closeConnections = async (): Promise<void> => {
  if (postgresPool) {
    await postgresPool.end();
  }
  if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb!.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

export default { dbGet, dbAll, dbRun, testConnection, closeConnections };
