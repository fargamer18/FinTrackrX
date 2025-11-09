import { safeQuery } from './db';

export type AccountRecord = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: string; // DECIMAL as string from pg
  currency: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function getUserAccounts(userId: string): Promise<AccountRecord[]> {
  const res = await safeQuery(
    'SELECT id, user_id, name, type, balance, currency, is_active, created_at, updated_at FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return res.rows as AccountRecord[];
}

export async function updateAccount(userId: string, accountId: string, partial: { name?: string; currency?: string; is_active?: boolean; }) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [key, value] of Object.entries(partial)) {
    if (value === undefined) continue;
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx++;
  }
  if (!fields.length) return;
  values.push(accountId);
  values.push(userId);
  const sql = `UPDATE accounts SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} AND user_id = $${idx+1}`;
  await safeQuery(sql, values);
}

export async function createAccount(userId: string, data: { name: string; type: string; currency?: string; balance?: number }) {
  const { name, type } = data;
  const currency = (data.currency || 'INR').toUpperCase();
  const balance = data.balance ?? 0;
  await safeQuery(
    `INSERT INTO accounts (user_id, name, type, currency, balance)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, name, type, currency, balance]
  );
}

export const accounts = {
  getUserAccounts,
  updateAccount,
  createAccount,
};
