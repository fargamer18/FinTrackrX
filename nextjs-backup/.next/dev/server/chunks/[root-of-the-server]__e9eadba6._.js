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
"[project]/fintrackrx/app/api/ai/advisor/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fintrackrx$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fintrackrx/node_modules/next/server.js [app-route] (ecmascript)");
;
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceTB/SmolLM3-3B';
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
async function POST(request) {
    try {
        const { question, financialData } = await request.json();
        if (!question) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$fintrackrx$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Question is required'
            }, {
                status: 400
            });
        }
        if (!HUGGINGFACE_TOKEN) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$fintrackrx$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Hugging Face token not configured'
            }, {
                status: 500
            });
        }
        // Create a detailed prompt with financial context
        const prompt = `You are a helpful financial advisor for Indian households. Answer the following question based on the user's financial data.

User's Financial Data:
- Monthly Income: ₹${financialData.monthlyIncome?.toLocaleString() || 0}
- Monthly Expenses: ₹${financialData.monthlyExpenses?.toLocaleString() || 0}
- Current Balance: ₹${financialData.balance?.toLocaleString() || 0}
- Savings Rate: ${financialData.savingsRate?.toFixed(1) || 0}%
- Number of Transactions: ${financialData.transactionCount || 0}

Question: ${question}

Provide a clear, concise, and actionable answer in 2-3 sentences. Focus on practical Indian financial advice.

Answer:`;
        // Call Hugging Face API
        const response = await fetch(HUGGINGFACE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true,
                    return_full_text: false
                }
            })
        });
        if (!response.ok) {
            const error = await response.text();
            console.error('Hugging Face API error:', error);
            // Fallback to rule-based response if API fails
            return __TURBOPACK__imported__module__$5b$project$5d2f$fintrackrx$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                answer: getFallbackAnswer(question, financialData),
                source: 'fallback'
            });
        }
        const result = await response.json();
        // Extract the generated text
        let answer = '';
        if (Array.isArray(result) && result.length > 0) {
            answer = result[0].generated_text?.trim() || '';
        } else if (result.generated_text) {
            answer = result.generated_text.trim();
        }
        // If answer is empty or too short, use fallback
        if (!answer || answer.length < 20) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$fintrackrx$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                answer: getFallbackAnswer(question, financialData),
                source: 'fallback'
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$fintrackrx$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            answer,
            source: 'ai'
        });
    } catch (error) {
        console.error('AI advisor error:', error);
        // Return fallback response on error
        const { question, financialData } = await request.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$fintrackrx$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            answer: getFallbackAnswer(question, financialData),
            source: 'fallback'
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

//# sourceMappingURL=%5Broot-of-the-server%5D__e9eadba6._.js.map