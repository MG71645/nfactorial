import { Pool, PoolClient } from 'pg';

// Создаем пул соединений
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // максимальное количество соединений в пуле
  idleTimeoutMillis: 30000, // время простоя соединения
  connectionTimeoutMillis: 2000, // время ожидания соединения
});

// Обработка ошибок пула
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Проверка соединения
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Connected to PostgreSQL database');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL:', error);
    return false;
  }
};

// Промис-обертки для удобства использования
export const dbQuery = async (text: string, params: any[] = []): Promise<any> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export const dbGet = async (text: string, params: any[] = []): Promise<any> => {
  const result = await dbQuery(text, params);
  return result.rows[0] || null;
};

export const dbAll = async (text: string, params: any[] = []): Promise<any[]> => {
  const result = await dbQuery(text, params);
  return result.rows;
};

export const dbRun = async (text: string, params: any[] = []): Promise<any> => {
  const result = await dbQuery(text, params);
  return {
    id: result.rows[0]?.id,
    changes: result.rowCount
  };
};

// Закрытие пула соединений (для graceful shutdown)
export const closePool = async (): Promise<void> => {
  await pool.end();
};

export default pool;
