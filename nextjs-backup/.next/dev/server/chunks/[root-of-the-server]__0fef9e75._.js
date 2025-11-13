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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Auth utilities for password hashing and token generation
__turbopack_context__.s([
    "auth",
    ()=>auth,
    "createMfaToken",
    ()=>createMfaToken,
    "createToken",
    ()=>createToken,
    "generateToken",
    ()=>generateToken,
    "hashPassword",
    ()=>hashPassword,
    "validation",
    ()=>validation,
    "verifyMfaToken",
    ()=>verifyMfaToken,
    "verifyPassword",
    ()=>verifyPassword,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/verify.js [app-route] (ecmascript)");
;
;
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET not set. Using default secret. This is unsafe for production!');
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
}
function generateToken() {
    return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
}
async function createToken(payload) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('7d').sign(JWT_SECRET);
}
async function verifyToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}
async function createMfaToken(payload) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        ...payload,
        mfa: true
    }).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('5m').sign(JWT_SECRET);
}
async function verifyMfaToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, JWT_SECRET);
        if (payload && payload.mfa === true) {
            return payload;
        }
        return null;
    } catch (error) {
        return null;
    }
}
const auth = {
    hashPassword,
    verifyPassword,
    generateToken,
    createToken,
    verifyToken,
    createMfaToken,
    verifyMfaToken
};
const validation = {
    email: (email)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    password: (password)=>{
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
    },
    passwordMessage: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
};
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
"[project]/lib/finnhub.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Finnhub API integration for stock market data
__turbopack_context__.s([
    "batchUpdatePrices",
    ()=>batchUpdatePrices,
    "finnhubService",
    ()=>finnhubService,
    "getCandles",
    ()=>getCandles,
    "getCompanyNews",
    ()=>getCompanyNews,
    "getCompanyProfile",
    ()=>getCompanyProfile,
    "getMarketNews",
    ()=>getMarketNews,
    "getQuote",
    ()=>getQuote,
    "searchSymbol",
    ()=>searchSymbol
]);
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd487ge1r01qk80bjptfgd487ge1r01qk80bjptg0';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
async function getQuote(symbol) {
    try {
        const response = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        return {
            currentPrice: data.c,
            change: data.d,
            percentChange: data.dp,
            high: data.h,
            low: data.l,
            open: data.o,
            previousClose: data.pc,
            timestamp: data.t
        };
    } catch (error) {
        console.error('Finnhub quote error:', error);
        return null;
    }
}
async function getCompanyProfile(symbol) {
    try {
        const response = await fetch(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        return {
            name: data.name,
            ticker: data.ticker,
            exchange: data.exchange,
            currency: data.currency,
            country: data.country,
            industry: data.finnhubIndustry,
            logo: data.logo,
            marketCap: data.marketCapitalization
        };
    } catch (error) {
        console.error('Finnhub profile error:', error);
        return null;
    }
}
async function searchSymbol(query) {
    try {
        const url = `${FINNHUB_BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`;
        console.log('🌐 Fetching from Finnhub:', url);
        const response = await fetch(url);
        const data = await response.json();
        console.log('📡 Raw Finnhub API response:', data);
        // Check if data.result exists and is an array
        if (!data.result || !Array.isArray(data.result)) {
            console.warn('⚠️ Unexpected Finnhub response structure:', data);
            return [];
        }
        const mapped = data.result.map((item)=>({
                symbol: item.symbol,
                description: item.description,
                type: item.type,
                displaySymbol: item.displaySymbol
            }));
        console.log('🔧 Mapped results:', mapped);
        return mapped;
    } catch (error) {
        console.error('❌ Finnhub search error:', error);
        return [];
    }
}
async function getCandles(symbol, resolution = 'D', from, to) {
    try {
        const response = await fetch(`${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        if (data.s !== 'ok') return null;
        return {
            timestamps: data.t,
            open: data.o,
            high: data.h,
            low: data.l,
            close: data.c,
            volume: data.v
        };
    } catch (error) {
        console.error('Finnhub candles error:', error);
        return null;
    }
}
async function getMarketNews(category = 'general') {
    try {
        const response = await fetch(`${FINNHUB_BASE_URL}/news?category=${category}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        return data.slice(0, 10).map((item)=>({
                headline: item.headline,
                summary: item.summary,
                source: item.source,
                url: item.url,
                image: item.image,
                datetime: item.datetime
            }));
    } catch (error) {
        console.error('Finnhub news error:', error);
        return [];
    }
}
async function getCompanyNews(symbol, from, to) {
    try {
        const response = await fetch(`${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        return data.slice(0, 10).map((item)=>({
                headline: item.headline,
                summary: item.summary,
                source: item.source,
                url: item.url,
                image: item.image,
                datetime: item.datetime
            }));
    } catch (error) {
        console.error('Finnhub company news error:', error);
        return [];
    }
}
async function batchUpdatePrices(symbols) {
    const quotes = await Promise.all(symbols.map(async (symbol)=>{
        const quote = await getQuote(symbol);
        return {
            symbol,
            price: quote?.currentPrice || 0
        };
    }));
    const priceMap = {};
    quotes.forEach(({ symbol, price })=>{
        priceMap[symbol] = price;
    });
    return priceMap;
}
const finnhubService = {
    getQuote,
    getCompanyProfile,
    searchSymbol,
    getCandles,
    getMarketNews,
    getCompanyNews,
    batchUpdatePrices
};
}),
"[project]/app/api/investments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$finnhub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/finnhub.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function GET(request) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!payload) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid token'
            }, {
                status: 401
            });
        }
        const userId = payload.userId;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeQuery"])(`SELECT 
        id, symbol, name, quantity, purchase_price, purchase_date, 
        current_price, currency, exchange, notes, created_at, updated_at
       FROM investments 
       WHERE user_id = $1 
       ORDER BY created_at DESC`, [
            userId
        ]);
        // Calculate portfolio totals
        let totalValue = 0;
        let totalCost = 0;
        const investments = result.rows.map((inv)=>{
            const currentValue = inv.quantity * (inv.current_price || inv.purchase_price);
            const costValue = inv.quantity * inv.purchase_price;
            totalValue += currentValue;
            totalCost += costValue;
            return {
                ...inv,
                currentValue,
                costValue,
                gain: currentValue - costValue,
                gainPercent: (currentValue - costValue) / costValue * 100
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            investments,
            portfolio: {
                totalValue,
                totalCost,
                totalGain: totalValue - totalCost,
                totalGainPercent: totalCost > 0 ? (totalValue - totalCost) / totalCost * 100 : 0
            }
        });
    } catch (error) {
        console.error('Get investments error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!payload) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid token'
            }, {
                status: 401
            });
        }
        const userId = payload.userId;
        const { symbol, quantity, purchasePrice, purchaseDate, notes } = await request.json();
        if (!symbol || !quantity || !purchasePrice) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Symbol, quantity, and purchase price are required'
            }, {
                status: 400
            });
        }
        // Fetch company info and current price from Finnhub
        let name = symbol;
        let currentPrice = purchasePrice;
        let currency = 'INR';
        let exchange = '';
        try {
            const [profile, quote] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$finnhub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCompanyProfile"])(symbol),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$finnhub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getQuote"])(symbol)
            ]);
            if (profile) {
                name = profile.name || symbol;
                currency = profile.currency || 'INR';
                exchange = profile.exchange || '';
            }
            if (quote && quote.currentPrice) {
                currentPrice = quote.currentPrice;
            }
        } catch (err) {
            console.error('Failed to fetch stock data:', err);
        // Continue with provided data
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeQuery"])(`INSERT INTO investments 
        (user_id, symbol, name, quantity, purchase_price, purchase_date, current_price, currency, exchange, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`, [
            userId,
            symbol.toUpperCase(),
            name,
            quantity,
            purchasePrice,
            purchaseDate || new Date(),
            currentPrice,
            currency,
            exchange,
            notes || null
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            investment: result.rows[0]
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Create investment error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0fef9e75._.js.map