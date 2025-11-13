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
"[project]/app/api/ai/recommendations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_API_VERSION = (process.env.GEMINI_API_VERSION || 'v1beta').trim();
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest').trim();
const GEMINI_API_URL = (process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent`).trim();
async function POST(request) {
    let parsed = {};
    try {
        parsed = await request.json();
        const { financialData } = parsed;
        if (!financialData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'financialData is required'
            }, {
                status: 400
            });
        }
        // Fallback basic recs
        const buildFallback = ()=>{
            const items = [];
            if (financialData.savingsRate < 20) {
                const needed = Math.max(0, Math.round(financialData.monthlyIncome * 0.2 - (financialData.monthlyIncome - financialData.monthlyExpenses)));
                items.push({
                    title: 'Boost Savings Rate',
                    desc: `Aim to save ₹${needed.toLocaleString()} more monthly by reducing discretionary spends and automating transfers.`
                });
            }
            if (financialData.expenseRatio > 70) {
                items.push({
                    title: 'Trim Expense Ratio',
                    desc: 'Target expense ratio below 70% by renegotiating bills, cutting subscriptions, and setting category caps.'
                });
            }
            if (items.length === 0) {
                items.push({
                    title: 'Build Emergency Fund',
                    desc: `Target 6 months expenses: ₹${(financialData.monthlyExpenses * 6).toLocaleString()}. Park in liquid funds.`
                });
                items.push({
                    title: 'Systematic Investing',
                    desc: 'Start/scale a SIP in diversified index funds for long-term goals.'
                });
            }
            return items;
        };
        if (!GEMINI_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items: buildFallback(),
                source: 'fallback'
            });
        }
        const condensedTx = financialData.transactions.slice(0, 25).map((t)=>`${t.type} ${t.category} ₹${t.amount}`).join('\n');
        const prompt = `You are a personal finance coach for Indian users. Based on the user's data and spending patterns, return JSON with an array "items" of 3-6 prioritized recommendations, each with {"title": string, "desc": string}. Keep advice practical and specific. No markdown.

User Data:
Income: ₹${financialData.monthlyIncome.toLocaleString()}  |  Expenses: ₹${financialData.monthlyExpenses.toLocaleString()}  |  Savings Rate: ${financialData.savingsRate.toFixed(1)}%  |  Expense Ratio: ${financialData.expenseRatio.toFixed(1)}%
Recent Transactions (up to 25):\n${condensedTx || 'None'}

Return ONLY valid JSON like {"items":[{"title":"...","desc":"..."}, ...]}.`;
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 280,
                    temperature: 0.5,
                    topP: 0.9
                }
            })
        });
        if (!response.ok) {
            const err = await response.text();
            console.error('Gemini recs error:', err);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items: buildFallback(),
                source: 'fallback'
            });
        }
        const result = await response.json();
        let text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        try {
            text = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
            const parsed = JSON.parse(text);
            const items = Array.isArray(parsed.items) ? parsed.items : [];
            if (items.length > 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items,
                source: 'ai'
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items: buildFallback(),
                source: 'fallback'
            });
        } catch (e) {
            console.warn('Failed to parse recs JSON; using fallback.', text);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items: buildFallback(),
                source: 'fallback'
            });
        }
    } catch (error) {
        console.error('Recommendations endpoint error', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            items: [
                {
                    title: 'Stabilize Finances',
                    desc: 'Reduce high-variance expenses and set category caps to improve predictability.'
                },
                {
                    title: 'Automate Savings',
                    desc: 'Set an auto-transfer the day income arrives; start with 10–20%.'
                }
            ],
            source: 'fallback'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6d028df4._.js.map