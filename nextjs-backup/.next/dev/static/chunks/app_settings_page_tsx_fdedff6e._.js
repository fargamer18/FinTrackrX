(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/settings/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AuthProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
// Dynamic import of qrcode to avoid type issues during build with React 19
let QRCodeLib = null;
async function ensureQrLib() {
    if (!QRCodeLib) {
        try {
            QRCodeLib = await __turbopack_context__.A("[project]/node_modules/qrcode/lib/browser.js [app-client] (ecmascript, async loader)");
        } catch (e) {
            console.error('Failed to load qrcode library', e);
        }
    }
    return QRCodeLib;
}
const DEFAULT_SETTINGS = {
    theme_mode: 'system',
    default_currency: 'INR',
    date_format: 'DD/MM/YYYY',
    number_format: 'standard',
    notifications_enabled: true,
    chart_palette: null
};
function SettingsPage() {
    _s();
    const { user, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SETTINGS);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [paletteDraft, setPaletteDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        '#3b82f6',
        '#10b981',
        '#facc15',
        '#f43f5e',
        '#a855f7'
    ]);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Profile');
    // Security state
    const [twoFAEnabled, setTwoFAEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [twoFASecret, setTwoFASecret] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [twoFAOtpauth, setTwoFAOtpauth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [twoFAToken, setTwoFAToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [securityBusy, setSecurityBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pwd, setPwd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        current: '',
        next: '',
        confirm: ''
    });
    const [pwdBusy, setPwdBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pwdMsg, setPwdMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetch2FA = async ()=>{
        try {
            const resp = await fetch('/api/security/2fa/status');
            if (resp.ok) {
                const d = await resp.json();
                if (d.success) {
                    setTwoFAEnabled(!!d.enabled);
                } else {
                    setTwoFAEnabled(false);
                }
            }
        } catch (e) {
            console.error('2FA status error', e);
            setTwoFAEnabled(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsPage.useEffect": ()=>{
            if (!user) return;
            const fetchSettings = {
                "SettingsPage.useEffect.fetchSettings": async ()=>{
                    setLoading(true);
                    try {
                        const resp = await fetch('/api/settings');
                        if (resp.ok) {
                            const data = await resp.json();
                            if (data.success && data.settings) {
                                setSettings({
                                    ...DEFAULT_SETTINGS,
                                    ...data.settings
                                });
                                if (data.settings.chart_palette?.categorical) {
                                    setPaletteDraft(data.settings.chart_palette.categorical);
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Fetch settings error', e);
                    } finally{
                        setLoading(false);
                    }
                }
            }["SettingsPage.useEffect.fetchSettings"];
            fetchSettings();
            fetch2FA();
        }
    }["SettingsPage.useEffect"], [
        user
    ]);
    async function saveSettings() {
        if (!user) return;
        setSaving(true);
        try {
            const resp = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...settings,
                    chart_palette: {
                        categorical: paletteDraft
                    }
                })
            });
            if (resp.ok) {
                const data = await resp.json();
                if (data.success) {
                    setSettings({
                        ...settings,
                        ...data.settings
                    });
                }
            }
        } catch (e) {
            console.error('Save settings error', e);
        } finally{
            setSaving(false);
        }
    }
    if (isLoading || loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6",
            children: "Loading settings..."
        }, void 0, false, {
            fileName: "[project]/app/settings/page.tsx",
            lineNumber: 122,
            columnNumber: 12
        }, this);
    }
    if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6",
            children: "Please log in to manage settings."
        }, void 0, false, {
            fileName: "[project]/app/settings/page.tsx",
            lineNumber: 125,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto p-6 space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-gray-900 dark:text-white",
                children: "⚙️ Settings"
            }, void 0, false, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-2",
                children: [
                    'Profile',
                    'Preferences',
                    'Security'
                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(t),
                        className: `px-4 py-2 text-sm rounded-t-md ${tab === t ? 'bg-white dark:bg-gray-800 border border-b-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`,
                        children: t
                    }, t, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            tab === 'Preferences' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-gray-900 dark:text-white",
                                children: "Preferences"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                                children: "Theme Mode"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm",
                                value: settings.theme_mode,
                                onChange: (e)=>setSettings((s)=>({
                                            ...s,
                                            theme_mode: e.target.value
                                        })),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "system",
                                        children: "System"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "light",
                                        children: "Light"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "dark",
                                        children: "Dark"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                                children: "Default Currency"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                className: "w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm",
                                value: settings.default_currency,
                                onChange: (e)=>setSettings((s)=>({
                                            ...s,
                                            default_currency: e.target.value.toUpperCase()
                                        }))
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                                children: "Date Format"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm",
                                value: settings.date_format,
                                onChange: (e)=>setSettings((s)=>({
                                            ...s,
                                            date_format: e.target.value
                                        })),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "DD/MM/YYYY",
                                        children: "DD/MM/YYYY"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "MM/DD/YYYY",
                                        children: "MM/DD/YYYY"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "YYYY-MM-DD",
                                        children: "YYYY-MM-DD"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                                children: "Number Format"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm",
                                value: settings.number_format,
                                onChange: (e)=>setSettings((s)=>({
                                            ...s,
                                            number_format: e.target.value
                                        })),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "standard",
                                        children: "Standard"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 183,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "compact",
                                        children: "Compact"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "notifications",
                                        type: "checkbox",
                                        checked: settings.notifications_enabled,
                                        onChange: (e)=>setSettings((s)=>({
                                                    ...s,
                                                    notifications_enabled: e.target.checked
                                                })),
                                        className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "notifications",
                                        className: "text-sm text-gray-700 dark:text-gray-300",
                                        children: "Enable Notifications"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-gray-900 dark:text-white",
                                children: "Chart Palette (RGB)"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 dark:text-gray-400",
                                children: "Customize categorical colors used in charts. Paste hex or use color pickers."
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    paletteDraft.map((c, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "color",
                                                    value: c,
                                                    onChange: (e)=>setPaletteDraft((p)=>p.map((v, i)=>i === idx ? e.target.value : v)),
                                                    className: "h-8 w-12 rounded-md"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/page.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: c,
                                                    onChange: (e)=>setPaletteDraft((p)=>p.map((v, i)=>i === idx ? e.target.value : v)),
                                                    className: "flex-1 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-xs"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/page.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setPaletteDraft((p)=>p.filter((_, i)=>i !== idx)),
                                                    className: "text-xs px-2 py-1 rounded-md bg-red-500 text-white",
                                                    children: "Remove"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/page.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/app/settings/page.tsx",
                                            lineNumber: 205,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setPaletteDraft((p)=>[
                                                    ...p,
                                                    '#6b7280'
                                                ]),
                                        className: "text-sm px-3 py-2 rounded-md bg-blue-600 text-white",
                                        children: "Add Color"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            tab === 'Profile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileTab, {}, void 0, false, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 233,
                columnNumber: 9
            }, this),
            tab === 'Security' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SecurityTab, {
                twoFAEnabled: twoFAEnabled,
                twoFASecret: twoFASecret,
                twoFAOtpauth: twoFAOtpauth,
                onRefreshStatus: fetch2FA,
                setTwoFASecret: setTwoFASecret,
                setTwoFAOtpauth: setTwoFAOtpauth,
                twoFAToken: twoFAToken,
                setTwoFAToken: setTwoFAToken,
                securityBusy: securityBusy,
                setSecurityBusy: setSecurityBusy,
                pwd: pwd,
                setPwd: setPwd,
                pwdBusy: pwdBusy,
                setPwdBusy: setPwdBusy,
                pwdMsg: pwdMsg,
                setPwdMsg: setPwdMsg
            }, void 0, false, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 236,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    disabled: saving,
                    onClick: saveSettings,
                    className: "px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50",
                    children: saving ? 'Saving...' : 'Save Settings'
                }, void 0, false, {
                    fileName: "[project]/app/settings/page.tsx",
                    lineNumber: 257,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/settings/page.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s(SettingsPage, "q3Qpqlea2ZiwNOpDkJwqDxblk1k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = SettingsPage;
function ProfileTab() {
    _s1();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        phone: '',
        bio: '',
        avatar_url: ''
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfileTab.useEffect": ()=>{
            const load = {
                "ProfileTab.useEffect.load": async ()=>{
                    setLoading(true);
                    try {
                        const r = await fetch('/api/profile');
                        if (r.ok) {
                            const d = await r.json();
                            if (d.user) setForm({
                                name: d.user.name || '',
                                phone: d.user.phone || '',
                                bio: d.user.bio || '',
                                avatar_url: d.user.avatar_url || ''
                            });
                        }
                    } finally{
                        setLoading(false);
                    }
                }
            }["ProfileTab.useEffect.load"];
            load();
        }
    }["ProfileTab.useEffect"], []);
    async function save() {
        setSaving(true);
        try {
            await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
        } finally{
            setSaving(false);
        }
    }
    async function uploadAvatar() {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('avatar', file);
            const r = await fetch('/api/profile/avatar', {
                method: 'POST',
                body: fd
            });
            const d = await r.json();
            if (r.ok && d.success && d.url) {
                setForm((f)=>({
                        ...f,
                        avatar_url: d.url
                    }));
                setFile(null);
            }
        } finally{
            setUploading(false);
        }
    }
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-sm text-gray-600 dark:text-gray-400",
        children: "Loading profile..."
    }, void 0, false, {
        fileName: "[project]/app/settings/page.tsx",
        lineNumber: 311,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: form.avatar_url || `https://www.gravatar.com/avatar/${(user?.email || '').trim().toLowerCase()}`,
                                alt: "avatar",
                                className: "h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-700",
                                onError: (e)=>{
                                    e.currentTarget.src = 'https://via.placeholder.com/64?text=👤';
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                                        children: "Avatar URL"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 319,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.avatar_url,
                                        onChange: (e)=>setForm((f)=>({
                                                    ...f,
                                                    avatar_url: e.target.value
                                                })),
                                        className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm",
                                        placeholder: "https://... (PNG/JPG/WebP) or /avatars/.."
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] text-gray-500 dark:text-gray-400 mt-1",
                                        children: "Paste an image URL or use the local upload below."
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                                        children: "Upload local image"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 326,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        accept: "image/png,image/jpeg,image/jpg,image/webp",
                                        onChange: (e)=>setFile(e.target.files?.[0] || null),
                                        className: "block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.tsx",
                                        lineNumber: 327,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: uploadAvatar,
                                disabled: !file || uploading,
                                className: "px-3 py-2 text-sm rounded-md bg-green-600 text-white disabled:opacity-50",
                                children: uploading ? 'Uploading...' : 'Upload'
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 329,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        disabled: true,
                        value: user?.email || '',
                        className: "w-full rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-2 text-sm"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                        children: "Name"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: form.name,
                        onChange: (e)=>setForm((f)=>({
                                    ...f,
                                    name: e.target.value
                                })),
                        className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                        children: "Phone"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: form.phone,
                        onChange: (e)=>setForm((f)=>({
                                    ...f,
                                    phone: e.target.value
                                })),
                        className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                        children: "Bio/Description"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        rows: 4,
                        value: form.bio,
                        onChange: (e)=>setForm((f)=>({
                                    ...f,
                                    bio: e.target.value
                                })),
                        className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: save,
                    disabled: saving,
                    className: "px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50",
                    children: saving ? 'Saving...' : 'Save Profile'
                }, void 0, false, {
                    fileName: "[project]/app/settings/page.tsx",
                    lineNumber: 349,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/settings/page.tsx",
        lineNumber: 314,
        columnNumber: 5
    }, this);
}
_s1(ProfileTab, "U0CNMmnu1eYhBEzAjPKFmgN26MI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c1 = ProfileTab;
function SecurityTab(props) {
    _s2();
    const { twoFAEnabled, twoFASecret, twoFAOtpauth, onRefreshStatus, setTwoFASecret, setTwoFAOtpauth, twoFAToken, setTwoFAToken, securityBusy, setSecurityBusy, pwd, setPwd, pwdBusy, setPwdBusy, pwdMsg, setPwdMsg } = props;
    const [qrDataUrl, setQrDataUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Regenerate QR when otpauth changes (e.g., after setup)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityTab.useEffect": ()=>{
            let active = true;
            ({
                "SecurityTab.useEffect": async ()=>{
                    try {
                        if (!twoFAOtpauth) {
                            if (active) setQrDataUrl(null);
                            return;
                        }
                        const lib = await ensureQrLib();
                        if (lib?.toDataURL) {
                            const url = await lib.toDataURL(twoFAOtpauth, {
                                margin: 1,
                                width: 200
                            });
                            if (active) setQrDataUrl(url);
                        }
                    } catch (e) {
                        console.error('QR generation failed', e);
                    }
                }
            })["SecurityTab.useEffect"]();
            return ({
                "SecurityTab.useEffect": ()=>{
                    active = false;
                }
            })["SecurityTab.useEffect"];
        }
    }["SecurityTab.useEffect"], [
        twoFAOtpauth
    ]);
    async function start2FA() {
        setSecurityBusy(true);
        try {
            const r = await fetch('/api/security/2fa/setup', {
                method: 'POST'
            });
            const d = await r.json();
            if (d.success) {
                setTwoFASecret(d.secret);
                setTwoFAOtpauth(d.otpauth);
                try {
                    const lib = await ensureQrLib();
                    if (lib?.toDataURL) {
                        const dataUrl = await lib.toDataURL(d.otpauth, {
                            margin: 1,
                            width: 200
                        });
                        setQrDataUrl(dataUrl);
                    }
                } catch  {}
            }
        } finally{
            setSecurityBusy(false);
        }
    }
    async function verify2FA() {
        if (!twoFAToken) return;
        setSecurityBusy(true);
        try {
            const r = await fetch('/api/security/2fa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: twoFAToken
                })
            });
            const d = await r.json();
            if (d.success) {
                setTwoFAToken('');
                setTwoFASecret(null);
                setTwoFAOtpauth(null);
                await onRefreshStatus();
            }
        } finally{
            setSecurityBusy(false);
        }
    }
    async function disable2FA() {
        setSecurityBusy(true);
        try {
            await fetch('/api/security/2fa/disable', {
                method: 'POST'
            });
            setTwoFASecret(null);
            setTwoFAOtpauth(null);
            setQrDataUrl(null);
            await onRefreshStatus();
        } finally{
            setSecurityBusy(false);
        }
    }
    async function changePassword() {
        setPwdMsg(null);
        if (!pwd.current || !pwd.next || pwd.next !== pwd.confirm) {
            setPwdMsg('Please fill all fields and ensure new passwords match.');
            return;
        }
        setPwdBusy(true);
        try {
            const r = await fetch('/api/security/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: pwd.current,
                    newPassword: pwd.next
                })
            });
            const d = await r.json();
            if (r.ok && d.success) {
                setPwd({
                    current: '',
                    next: '',
                    confirm: ''
                });
                setPwdMsg('Password updated successfully.');
            } else {
                setPwdMsg(d.error || 'Failed to update password');
            }
        } finally{
            setPwdBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid md:grid-cols-2 gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-gray-900 dark:text-white",
                        children: "Two‑Factor Authentication (TOTP)"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this),
                    twoFAEnabled === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: "Loading 2FA status..."
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 472,
                        columnNumber: 11
                    }, this) : twoFAEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-green-600",
                                children: "2FA is enabled for your account."
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 475,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: disable2FA,
                                disabled: securityBusy,
                                className: "px-3 py-2 text-sm rounded-md bg-red-600 text-white disabled:opacity-50",
                                children: securityBusy ? 'Working...' : 'Disable 2FA'
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 476,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 474,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: !twoFASecret ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: start2FA,
                            disabled: securityBusy,
                            className: "px-3 py-2 text-sm rounded-md bg-blue-600 text-white disabled:opacity-50",
                            children: securityBusy ? 'Working...' : 'Set up 2FA'
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.tsx",
                            lineNumber: 481,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-700 dark:text-gray-300",
                                    children: "Add to your authenticator app using this secret:"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.tsx",
                                    lineNumber: 484,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-xs break-all",
                                    children: twoFASecret
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.tsx",
                                    lineNumber: 485,
                                    columnNumber: 17
                                }, this),
                                qrDataUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: qrDataUrl,
                                            alt: "2FA QR",
                                            className: "h-32 w-32 border border-gray-200 dark:border-gray-700 rounded-md bg-white p-1"
                                        }, void 0, false, {
                                            fileName: "[project]/app/settings/page.tsx",
                                            lineNumber: 488,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] text-gray-500 dark:text-gray-400 break-all",
                                            children: "Scan this QR in Google Authenticator, Authy, etc. If needed, use the secret above."
                                        }, void 0, false, {
                                            fileName: "[project]/app/settings/page.tsx",
                                            lineNumber: 489,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/settings/page.tsx",
                                    lineNumber: 487,
                                    columnNumber: 19
                                }, this) : twoFAOtpauth ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[11px] text-gray-500 dark:text-gray-400 break-all",
                                    children: [
                                        "QR is generating… If it doesn’t appear, you can add using this link: ",
                                        twoFAOtpauth
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/settings/page.tsx",
                                    lineNumber: 492,
                                    columnNumber: 19
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-end gap-2 mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                                                    children: "Enter 6‑digit code"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/page.tsx",
                                                    lineNumber: 496,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: twoFAToken,
                                                    onChange: (e)=>setTwoFAToken(e.target.value),
                                                    maxLength: 6,
                                                    className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm tracking-widest"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/settings/page.tsx",
                                                    lineNumber: 497,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/settings/page.tsx",
                                            lineNumber: 495,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: verify2FA,
                                            disabled: securityBusy || twoFAToken.length !== 6,
                                            className: "px-3 py-2 text-sm rounded-md bg-green-600 text-white disabled:opacity-50",
                                            children: "Verify & Enable"
                                        }, void 0, false, {
                                            fileName: "[project]/app/settings/page.tsx",
                                            lineNumber: 499,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/settings/page.tsx",
                                    lineNumber: 494,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/settings/page.tsx",
                            lineNumber: 483,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 479,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 469,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-gray-900 dark:text-white",
                        children: "Change Password"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, this),
                    pwdMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300",
                        children: pwdMsg
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 510,
                        columnNumber: 20
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                                children: "Current Password"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 512,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                value: pwd.current,
                                onChange: (e)=>setPwd({
                                        ...pwd,
                                        current: e.target.value
                                    }),
                                className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 513,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 511,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                                children: "New Password"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                value: pwd.next,
                                onChange: (e)=>setPwd({
                                        ...pwd,
                                        next: e.target.value
                                    }),
                                className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 517,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 515,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs text-gray-600 dark:text-gray-400 mb-1",
                                children: "Confirm New Password"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 520,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                value: pwd.confirm,
                                onChange: (e)=>setPwd({
                                        ...pwd,
                                        confirm: e.target.value
                                    }),
                                className: "w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.tsx",
                                lineNumber: 521,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 519,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: changePassword,
                            disabled: pwdBusy,
                            className: "px-3 py-2 text-sm rounded-md bg-blue-600 text-white disabled:opacity-50",
                            children: pwdBusy ? 'Updating...' : 'Update Password'
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.tsx",
                            lineNumber: 524,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.tsx",
                        lineNumber: 523,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/settings/page.tsx",
                lineNumber: 508,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/settings/page.tsx",
        lineNumber: 467,
        columnNumber: 5
    }, this);
}
_s2(SecurityTab, "CHtE9SoBawuXJBi/qAH6SgxUkeU=");
_c2 = SecurityTab;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SettingsPage");
__turbopack_context__.k.register(_c1, "ProfileTab");
__turbopack_context__.k.register(_c2, "SecurityTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_settings_page_tsx_fdedff6e._.js.map