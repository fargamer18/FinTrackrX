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
"[project]/app/api/ai/advisor/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Allow flexible configuration of Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_API_VERSION = (process.env.GEMINI_API_VERSION || 'v1beta').trim();
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest').trim();
const GEMINI_API_URL = (process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent`).trim();
async function POST(request) {
    let parsed = {};
    try {
        // Parse body once; avoid re-reading in catch
        parsed = await request.json();
        const { question, financialData } = parsed;
        if (!question) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Question is required'
            }, {
                status: 400
            });
        }
        // If token missing, graceful fallback (200) instead of 500
        if (!GEMINI_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                answer: getFallbackAnswer(question, financialData || {}),
                source: 'fallback',
                warning: 'GEMINI_API_KEY not set; using rule-based advisor.'
            });
        }
        // Create a detailed prompt with financial context
        const prompt = `You are a helpful financial advisor for Indian households. Answer the following question based on the user's financial data.\n\nUser's Financial Data:\n- Monthly Income: ₹${financialData.monthlyIncome?.toLocaleString() || 0}\n- Monthly Expenses: ₹${financialData.monthlyExpenses?.toLocaleString() || 0}\n- Current Balance: ₹${financialData.balance?.toLocaleString() || 0}\n- Savings Rate: ${financialData.savingsRate?.toFixed(1) || 0}%\n- Number of Transactions: ${financialData.transactionCount || 0}\n\nQuestion: ${question}\n\nProvide a clear, concise, and actionable answer in 2-3 sentences. Focus on practical Indian financial advice.`;
        // Call Gemini API
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
                    maxOutputTokens: 150,
                    temperature: 0.7,
                    topP: 0.9
                }
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                answer: getFallbackAnswer(question, financialData),
                source: 'fallback',
                warning: 'Model API error; served fallback.'
            });
        }
        const result = await response.json();
        // Extract the generated text from Gemini response
        let answer = '';
        if (result.candidates && Array.isArray(result.candidates) && result.candidates.length > 0) {
            answer = result.candidates[0].content?.parts?.[0]?.text?.trim() || '';
        }
        // If answer is empty or too short, use fallback
        if (!answer || answer.length < 20) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                answer: getFallbackAnswer(question, financialData),
                source: 'fallback',
                warning: 'AI response too short; served fallback.'
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            answer,
            source: 'ai'
        });
    } catch (error) {
        console.error('AI advisor error:', error);
        const { question = '', financialData = {} } = parsed;
        if (!question) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Question is required'
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            answer: getFallbackAnswer(question, financialData),
            source: 'fallback',
            warning: 'Unexpected error; served fallback.'
        });
    }
}
// Fallback rule-based responses
function getFallbackAnswer(question, financialData) {
    const q = question.toLowerCase();
    const { monthlyIncome = 0, monthlyExpenses = 0, savingsRate = 0 } = financialData;
    const savings = monthlyIncome - monthlyExpenses;
    if (q.includes('sav') || q.includes('save')) {
        return `Based on your current spending, you can save approximately ₹${Math.max(0, savings).toLocaleString()} per month. Consider automating transfers to a savings account and aim for a 20-30% savings rate for financial security.`;
    }
    if (q.includes('invest') || q.includes('investment') || q.includes('sip')) {
        return `For Indian households, start with a SIP in diversified mutual funds. With your monthly savings of ₹${Math.max(0, savings).toLocaleString()}, consider investing 50-60% in equity funds and 40-50% in debt funds for balanced growth.`;
    }
    if (q.includes('budget') || q.includes('expense')) {
        const expenseRatio = monthlyIncome > 0 ? monthlyExpenses / monthlyIncome * 100 : 0;
        return `Your monthly expenses are ₹${monthlyExpenses.toLocaleString()}, which is ${expenseRatio.toFixed(1)}% of your income. Try to keep expenses below 70% of income. Focus on reducing discretionary spending and track all expenses regularly.`;
    }
    if (q.includes('emergency') || q.includes('fund')) {
        const emergencyFund = monthlyExpenses * 6;
        return `Your emergency fund should cover 6 months of expenses, which is ₹${emergencyFund.toLocaleString()}. Start by saving 10-15% of your income each month in a liquid fund or high-yield savings account.`;
    }
    if (q.includes('tax') || q.includes('80c')) {
        return `To save tax under Section 80C, invest up to ₹1.5 lakh annually in ELSS, PPF, or NPS. Additionally, consider health insurance (80D) and home loan interest (24b) for more deductions. Plan your tax-saving investments before March each year.`;
    }
    if (q.includes('debt') || q.includes('loan') || q.includes('credit card')) {
        return `Prioritize clearing high-interest debts like credit cards (18-40% APR) first. Use the avalanche method: pay minimums on all debts, then extra on the highest interest rate. Avoid taking new loans until existing debts are under control.`;
    }
    // Default response
    return `Based on your financial data: You have a savings rate of ${savingsRate.toFixed(1)}%. Your monthly income is ₹${monthlyIncome.toLocaleString()} and expenses are ₹${monthlyExpenses.toLocaleString()}. Focus on maintaining a savings rate above 20% and building an emergency fund of 6 months' expenses for long-term financial security.`;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2eae570b._.js.map