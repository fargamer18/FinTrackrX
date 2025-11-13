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
"[project]/lib/indian-stock-api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Indian Stock Exchange API integration for Indian stock market data
__turbopack_context__.s([
    "getIndianStockData",
    ()=>getIndianStockData,
    "searchIndianInvestments",
    ()=>searchIndianInvestments,
    "searchIndianStocks",
    ()=>searchIndianStocks,
    "searchMutualFunds",
    ()=>searchMutualFunds
]);
const INDIAN_API_KEY = process.env.RAPID_API_KEY || 'your-rapidapi-key-here';
const INDIAN_API_HOST = 'indian-stock-exchange-api2.p.rapidapi.com';
const INDIAN_API_BASE_URL = `https://${INDIAN_API_HOST}`;
async function searchIndianStocks(query) {
    try {
        const url = `${INDIAN_API_BASE_URL}/industry_search?query=${encodeURIComponent(query)}`;
        console.log('🌐 Fetching from Indian API:', url);
        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), 5000); // 5 second timeout
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': INDIAN_API_HOST,
                'X-RapidAPI-Key': INDIAN_API_KEY
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log('📡 Raw Indian API response:', data);
        // Check if data is an array
        if (!Array.isArray(data)) {
            console.warn('⚠️ Unexpected Indian API response structure:', data);
            return [];
        }
        const mapped = data.slice(0, 10).map((item)=>({
                symbol: item.exchangeCodeNsi || item.exchangeCodeBse || item.commonName,
                description: item.commonName,
                type: 'Indian Stock',
                displaySymbol: item.exchangeCodeNsi || item.exchangeCodeBse,
                industry: item.mgIndustry,
                sector: item.mgSector,
                bseCode: item.exchangeCodeBse,
                nseCode: item.exchangeCodeNsi,
                stockTrends: item.activeStockTrends
            }));
        console.log('🔧 Mapped Indian stock results:', mapped);
        return mapped;
    } catch (error) {
        console.error('❌ Indian Stock API search error:', error);
        // Return fallback data for common Indian stocks
        if (error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message?.includes('fetch failed') || error.message?.includes('timeout')) {
            console.log('🔄 API timeout/fetch failed, using fallback data...');
            return getFallbackIndianStocks(query);
        }
        return [];
    }
}
async function getIndianStockData(stockName) {
    try {
        const url = `${INDIAN_API_BASE_URL}/stock?name=${encodeURIComponent(stockName)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': INDIAN_API_HOST,
                'X-RapidAPI-Key': INDIAN_API_KEY
            }
        });
        const data = await response.json();
        return {
            tickerId: data.tickerId,
            companyName: data.companyName,
            industry: data.industry,
            currentPrice: {
                BSE: data.currentPrice?.BSE,
                NSE: data.currentPrice?.NSE
            },
            percentChange: data.percentChange,
            yearHigh: data.yearHigh,
            yearLow: data.yearLow,
            companyProfile: data.companyProfile
        };
    } catch (error) {
        console.error('Indian Stock API get data error:', error);
        return null;
    }
}
async function searchMutualFunds(query) {
    try {
        const url = `${INDIAN_API_BASE_URL}/mutual_fund_search?query=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': INDIAN_API_HOST,
                'X-RapidAPI-Key': INDIAN_API_KEY
            }
        });
        const data = await response.json();
        if (!Array.isArray(data)) {
            return [];
        }
        return data.slice(0, 10).map((item)=>({
                symbol: item.id,
                description: item.schemeName,
                type: 'Mutual Fund',
                displaySymbol: item.id,
                isin: item.isin,
                schemeType: item.schemeType
            }));
    } catch (error) {
        console.error('Indian Mutual Fund search error:', error);
        // Return empty array for mutual funds if API fails
        if (error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message?.includes('fetch failed') || error.message?.includes('timeout')) {
            console.log('🔄 Mutual Fund API timeout/fetch failed, returning empty array...');
        }
        return [];
    }
}
async function searchIndianInvestments(query) {
    try {
        // Search both stocks and mutual funds
        const [stockResults, mfResults] = await Promise.all([
            searchIndianStocks(query),
            searchMutualFunds(query)
        ]);
        // Combine and return results
        return [
            ...stockResults,
            ...mfResults
        ];
    } catch (error) {
        console.error('Combined Indian investment search error:', error);
        return [];
    }
}
// Fallback data for common Indian stocks when API is unavailable
function getFallbackIndianStocks(query) {
    const commonStocks = [
        {
            symbol: 'RELIANCE',
            description: 'Reliance Industries Limited',
            type: 'Indian Stock',
            displaySymbol: 'RELIANCE',
            industry: 'Oil & Gas',
            sector: 'Energy'
        },
        {
            symbol: 'TCS',
            description: 'Tata Consultancy Services Limited',
            type: 'Indian Stock',
            displaySymbol: 'TCS',
            industry: 'Software & Programming',
            sector: 'Technology'
        },
        {
            symbol: 'INFY',
            description: 'Infosys Limited',
            type: 'Indian Stock',
            displaySymbol: 'INFY',
            industry: 'Software & Programming',
            sector: 'Technology'
        },
        {
            symbol: 'HDFCBANK',
            description: 'HDFC Bank Limited',
            type: 'Indian Stock',
            displaySymbol: 'HDFCBANK',
            industry: 'Banks',
            sector: 'Financial Services'
        },
        {
            symbol: 'ICICIBANK',
            description: 'ICICI Bank Limited',
            type: 'Indian Stock',
            displaySymbol: 'ICICIBANK',
            industry: 'Banks',
            sector: 'Financial Services'
        },
        {
            symbol: 'SBIN',
            description: 'State Bank of India',
            type: 'Indian Stock',
            displaySymbol: 'SBIN',
            industry: 'Banks',
            sector: 'Financial Services'
        },
        {
            symbol: 'BHARTIARTL',
            description: 'Bharti Airtel Limited',
            type: 'Indian Stock',
            displaySymbol: 'BHARTIARTL',
            industry: 'Telecom',
            sector: 'Telecommunication'
        },
        {
            symbol: 'ITC',
            description: 'ITC Limited',
            type: 'Indian Stock',
            displaySymbol: 'ITC',
            industry: 'FMCG',
            sector: 'Consumer Goods'
        },
        {
            symbol: 'LT',
            description: 'Larsen & Toubro Limited',
            type: 'Indian Stock',
            displaySymbol: 'LT',
            industry: 'Construction',
            sector: 'Infrastructure'
        },
        {
            symbol: 'WIPRO',
            description: 'Wipro Limited',
            type: 'Indian Stock',
            displaySymbol: 'WIPRO',
            industry: 'Software & Programming',
            sector: 'Technology'
        },
        {
            symbol: 'MARUTI',
            description: 'Maruti Suzuki India Limited',
            type: 'Indian Stock',
            displaySymbol: 'MARUTI',
            industry: 'Auto',
            sector: 'Automotive'
        },
        {
            symbol: 'TATAMOTORS',
            description: 'Tata Motors Limited',
            type: 'Indian Stock',
            displaySymbol: 'TATAMOTORS',
            industry: 'Auto',
            sector: 'Automotive'
        },
        {
            symbol: 'ADANIPORTS',
            description: 'Adani Ports and Special Economic Zone Limited',
            type: 'Indian Stock',
            displaySymbol: 'ADANIPORTS',
            industry: 'Infrastructure',
            sector: 'Infrastructure'
        },
        {
            symbol: 'ONGC',
            description: 'Oil and Natural Gas Corporation Limited',
            type: 'Indian Stock',
            displaySymbol: 'ONGC',
            industry: 'Oil & Gas',
            sector: 'Energy'
        },
        {
            symbol: 'NTPC',
            description: 'NTPC Limited',
            type: 'Indian Stock',
            displaySymbol: 'NTPC',
            industry: 'Power',
            sector: 'Utilities'
        }
    ];
    const lowerQuery = query.toLowerCase();
    console.log(`🔍 Fallback search for: "${query}" (lowercase: "${lowerQuery}")`);
    const filtered = commonStocks.filter((stock)=>{
        const symbolMatch = stock.symbol.toLowerCase().includes(lowerQuery);
        const descMatch = stock.description.toLowerCase().includes(lowerQuery);
        const industryMatch = stock.industry.toLowerCase().includes(lowerQuery);
        // Handle common typos for Tata companies
        const isTypoMatch = (lowerQuery === 'tatta' || lowerQuery === 'tat' || lowerQuery === 'tata') && stock.description.toLowerCase().includes('tata');
        if (symbolMatch || descMatch || industryMatch || isTypoMatch) {
            console.log(`✅ Match found: ${stock.symbol} - ${stock.description}`);
            console.log(`   Symbol: "${stock.symbol.toLowerCase()}" includes "${lowerQuery}"? ${symbolMatch}`);
            console.log(`   Desc: "${stock.description.toLowerCase()}" includes "${lowerQuery}"? ${descMatch}`);
            console.log(`   Industry: "${stock.industry.toLowerCase()}" includes "${lowerQuery}"? ${industryMatch}`);
            if (isTypoMatch) console.log(`   Typo match for Tata companies: ${isTypoMatch}`);
        }
        return symbolMatch || descMatch || industryMatch || isTypoMatch;
    }).slice(0, 10);
    console.log(`🎯 Fallback results: ${filtered.length} matches`);
    return filtered;
}
}),
"[project]/app/api/stocks/search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indian$2d$stock$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indian-stock-api.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        console.log('🔍 Indian stock search API called with query:', query);
        if (!query || query.length < 1) {
            console.log('❌ Query too short or empty');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                results: []
            });
        }
        console.log('📡 Calling searchIndianInvestments...');
        const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indian$2d$stock$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchIndianInvestments"])(query);
        console.log('📦 Indian API results count:', results?.length || 0);
        console.log('📦 First few results:', results?.slice(0, 3));
        // Results are already filtered and formatted
        console.log('✅ Final results count:', results.length);
        console.log('✅ Final results:', results);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            results
        });
    } catch (error) {
        console.error('❌ Indian stock search error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to search Indian investments'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6361665b._.js.map