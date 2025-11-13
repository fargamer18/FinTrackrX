module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// Database connection pool for PostgreSQL
__turbopack_context__.s([
    "db",
    ()=>db,
    "default",
    ()=>__TURBOPACK__default__export__,
    "query",
    ()=>query,
    "safeQuery",
    ()=>safeQuery,
    "withTransaction",
    ()=>withTransaction
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Support discrete DB_* env vars or a full DATABASE_URL
function buildConnectionString() {
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
const useSsl = (process.env.DATABASE_SSL || '').toLowerCase() === 'true' || connectionString?.includes('supabase.com') || connectionString?.includes('supabase.co');
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
    connectionString: connectionString,
    max: 20,
    // Increase timeouts to be more tolerant of transient network/DB latency
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    ssl: useSsl ? {
        rejectUnauthorized: false
    } : undefined
});
// Test connection
pool.on('connect', ()=>{
    console.log('✅ Database connected');
});
pool.on('error', (err)=>{
    console.error('❌ Unexpected database error:', err);
    // Don't exit process in production, just log the error
    if ("TURBOPACK compile-time truthy", 1) {
        process.exit(-1);
    }
});
const __TURBOPACK__default__export__ = pool;
const query = pool.query.bind(pool);
async function safeQuery(text, params) {
    const maxAttempts = 3;
    for(let attempt = 1; attempt <= maxAttempts; attempt++){
        try {
            return await pool.query(text, params);
        } catch (err) {
            const msg = err?.message || '';
            const isTransient = msg.includes('Connection terminated') || msg.includes('connection timeout') || msg.includes('Connection terminated unexpectedly') || msg.includes('ECONNRESET') || err?.code === '57P01' || err?.code === 'ECONNRESET' || err?.code === '57P03';
            if (attempt < maxAttempts && isTransient) {
                console.warn(`⚠️ Transient DB error (attempt ${attempt}): ${msg}. Retrying in ${attempt * 300}ms...`);
                await new Promise((resolve)=>setTimeout(resolve, attempt * 300));
                continue;
            }
            throw err;
        }
    }
    throw new Error('safeQuery: exhausted retries without success');
}
async function withTransaction(callback) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally{
        client.release();
    }
}
const db = {
    // Users
    async getUserByEmail (email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [
            email
        ]);
        return result.rows[0];
    },
    async getUserById (id) {
        const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [
            id
        ]);
        return result.rows[0];
    },
    async createUser (email, name, passwordHash) {
        const result = await pool.query('INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at', [
            email,
            name,
            passwordHash
        ]);
        return result.rows[0];
    },
    async updateUserPassword (userId, passwordHash) {
        await pool.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
            passwordHash,
            userId
        ]);
    },
    async updateLastLogin (userId) {
        await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [
            userId
        ]);
    },
    // Verification tokens
    async createVerificationToken (userId, token, expiresAt) {
        await pool.query('INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [
            userId,
            token,
            expiresAt
        ]);
    },
    async getVerificationToken (token) {
        const result = await pool.query('SELECT * FROM verification_tokens WHERE token = $1 AND expires_at > NOW()', [
            token
        ]);
        return result.rows[0];
    },
    async deleteVerificationToken (token) {
        await pool.query('DELETE FROM verification_tokens WHERE token = $1', [
            token
        ]);
    },
    // Transactions
    async getTransactions (userId, limit = 50, offset = 0) {
        const result = await pool.query(`SELECT t.*, c.name as category_name, a.name as account_name 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN accounts a ON t.account_id = a.id
       WHERE t.user_id = $1
       ORDER BY t.date DESC, t.created_at DESC
       LIMIT $2 OFFSET $3`, [
            userId,
            limit,
            offset
        ]);
        return result.rows;
    },
    async createTransaction (userId, data) {
        const result = await pool.query(`INSERT INTO transactions (user_id, account_id, category_id, type, amount, description, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [
            userId,
            data.accountId,
            data.categoryId,
            data.type,
            data.amount,
            data.description,
            data.date,
            data.notes
        ]);
        return result.rows[0];
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/health/db/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET() {
    try {
        const start = Date.now();
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT 1 as ok');
        const ms = Date.now() - start;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            db: 'ok',
            latency_ms: ms,
            result: res.rows[0]
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: e?.message || 'db-error'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8e8236f1._.js.map