import pool, { safeQuery } from './db';

// Ensure user_settings table exists (lazy creation for fresh Supabase)
let ensuredUserSettings = false;
async function ensureUserSettingsTable() {
  if (ensuredUserSettings) return;
  try {
    await safeQuery('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await safeQuery(`CREATE TABLE IF NOT EXISTS user_settings (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      theme_mode VARCHAR(10) DEFAULT 'system',
      default_currency VARCHAR(3) DEFAULT 'INR',
      date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
      number_format VARCHAR(20) DEFAULT 'standard',
      notifications_enabled BOOLEAN DEFAULT true,
      chart_palette JSONB,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`);
  } catch (e) {
    console.error('ensureUserSettingsTable failed:', e);
  } finally {
    ensuredUserSettings = true;
  }
}

export type UserSettings = {
  user_id: string;
  theme_mode: 'light' | 'dark' | 'system';
  default_currency: string;
  date_format: string;
  number_format: 'standard' | 'compact';
  notifications_enabled: boolean;
  chart_palette?: {
    categorical?: string[];
    income?: string;
    expense?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
};

export async function getUserSettings(userId: string): Promise<UserSettings> {
  await ensureUserSettingsTable();
  const result = await safeQuery('SELECT * FROM user_settings WHERE user_id = $1', [userId]);
  if (result.rows[0]) {
    return result.rows[0];
  }
  // Create default settings row if missing
  const insert = await safeQuery(
    `INSERT INTO user_settings (user_id) VALUES ($1)
     RETURNING *`,
    [userId]
  );
  return insert.rows[0];
}

export async function updateUserSettings(userId: string, partial: Partial<UserSettings>): Promise<UserSettings> {
  await ensureUserSettingsTable();
  // Build dynamic update
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [key, value] of Object.entries(partial)) {
    if (value === undefined) continue;
    fields.push(`${key} = $${idx}`);
    values.push(key === 'chart_palette' ? JSON.stringify(value) : value);
    idx++;
  }
  if (!fields.length) {
    const current = await getUserSettings(userId);
    return current;
  }
  values.push(userId);
  const sql = `UPDATE user_settings SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${idx} RETURNING *`;
  const result = await safeQuery(sql, values);
  return result.rows[0];
}

// Account update helpers (rename, deactivate, change currency)
export async function renameAccount(userId: string, accountId: string, name: string) {
  await safeQuery(
    'UPDATE accounts SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
    [name, accountId, userId]
  );
}

export async function setAccountActive(userId: string, accountId: string, isActive: boolean) {
  await safeQuery(
    'UPDATE accounts SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
    [isActive, accountId, userId]
  );
}

export async function changeAccountCurrency(userId: string, accountId: string, currency: string) {
  await safeQuery(
    'UPDATE accounts SET currency = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
    [currency, accountId, userId]
  );
}

export const settings = {
  getUserSettings,
  updateUserSettings,
  renameAccount,
  setAccountActive,
  changeAccountCurrency,
};
