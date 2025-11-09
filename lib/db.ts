// Database connection pool for PostgreSQL
import { Pool, PoolClient, QueryResult } from 'pg';

// Support discrete DB_* env vars or a full DATABASE_URL
function buildConnectionString(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASSWORD;
  const name = process.env.DB_NAME;
  const port = process.env.DB_PORT || '5432';
  if (host && user && pass && name) {
    return `postgresql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${name}`;
  }
  return undefined;
}

const connectionString = buildConnectionString();
if (!connectionString) {
  console.warn('⚠️  WARNING: No database connection details provided. Set DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.');
}

// Enable SSL automatically for Supabase or when DATABASE_SSL=true
const useSsl = (process.env.DATABASE_SSL || '').toLowerCase() === 'true' || (connectionString?.includes('supabase.com') || connectionString?.includes('supabase.co'));

const pool = new Pool({
  connectionString: connectionString,
  max: 20,
  // Increase timeouts to be more tolerant of transient network/DB latency
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  // Don't exit process in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

export default pool;

// Export query function
export const query = pool.query.bind(pool);

// Safe query with retry for transient connection issues
export async function safeQuery(text: string, params?: any[]): Promise<QueryResult<any>> {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await pool.query(text, params);
    } catch (err: any) {
      const msg = err?.message || '';
      const isTransient = msg.includes('Connection terminated') || msg.includes('connection timeout') || msg.includes('Connection terminated unexpectedly') || msg.includes('ECONNRESET') || err?.code === '57P01' || err?.code === 'ECONNRESET' || err?.code === '57P03';
      if (attempt < maxAttempts && isTransient) {
        console.warn(`⚠️ Transient DB error (attempt ${attempt}): ${msg}. Retrying in ${attempt * 300}ms...`);
        await new Promise((resolve) => setTimeout(resolve, attempt * 300));
        continue;
      }
      throw err;
    }
  }
  throw new Error('safeQuery: exhausted retries without success');
}

// Helper function for transactions
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Common database queries
export const db = {
  // Users
  async getUserByEmail(email: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async getUserById(id: string) {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async createUser(email: string, name: string, passwordHash: string) {
    const result = await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, name, passwordHash]
    );
    return result.rows[0];
  },

  async updateUserPassword(userId: string, passwordHash: string) {
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, userId]
    );
  },

  async updateLastLogin(userId: string) {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  },

  // Verification tokens
  async createVerificationToken(userId: string, token: string, expiresAt: Date) {
    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
  },

  async getVerificationToken(token: string) {
    const result = await pool.query(
      'SELECT * FROM verification_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    return result.rows[0];
  },

  async deleteVerificationToken(token: string) {
    await pool.query('DELETE FROM verification_tokens WHERE token = $1', [token]);
  },

  // Transactions
  async getTransactions(userId: string, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT t.*, c.name as category_name, a.name as account_name 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN accounts a ON t.account_id = a.id
       WHERE t.user_id = $1
       ORDER BY t.date DESC, t.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },

  async createTransaction(userId: string, data: {
    accountId?: string;
    categoryId?: string;
    type: string;
    amount: number;
    description?: string;
    date: Date;
    notes?: string;
  }) {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, account_id, category_id, type, amount, description, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, data.accountId, data.categoryId, data.type, data.amount, data.description, data.date, data.notes]
    );
    return result.rows[0];
  },
};
