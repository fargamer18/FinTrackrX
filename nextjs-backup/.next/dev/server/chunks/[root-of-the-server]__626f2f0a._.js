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
"[project]/app/api/stocks/search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$finnhub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/finnhub.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        console.log('🔍 Stock search API called with query:', query);
        if (!query || query.length < 1) {
            console.log('❌ Query too short or empty');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                results: []
            });
        }
        console.log('📡 Calling searchSymbol...');
        const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$finnhub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchSymbol"])(query);
        console.log('📦 Raw Finnhub results count:', results?.length || 0);
        console.log('📦 First few results:', results?.slice(0, 3));
        // Temporarily show ALL results to see what types Finnhub returns
        const filteredResults = results.slice(0, 10); // Just limit count, no type filtering
        console.log('✅ All result types found:');
        results.forEach((result, index)=>{
            console.log(`  ${index + 1}. ${result.symbol} - ${result.description} (TYPE: "${result.type}")`);
        });
        console.log('✅ Filtered results count:', filteredResults.length);
        console.log('✅ Final results:', filteredResults);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            results: filteredResults
        });
    } catch (error) {
        console.error('❌ Stock search error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to search stocks'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__626f2f0a._.js.map