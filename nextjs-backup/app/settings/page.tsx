"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
// Dynamic import of qrcode to avoid type issues during build with React 19
let QRCodeLib: any = null;
async function ensureQrLib() {
  if (!QRCodeLib) {
    try {
      QRCodeLib = await import('qrcode');
    } catch (e) {
      console.error('Failed to load qrcode library', e);
    }
  }
  return QRCodeLib;
}

type SettingsState = {
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
};

const DEFAULT_SETTINGS: SettingsState = {
  theme_mode: 'system',
  default_currency: 'INR',
  date_format: 'DD/MM/YYYY',
  number_format: 'standard',
  notifications_enabled: true,
  chart_palette: null,
};

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paletteDraft, setPaletteDraft] = useState<string[]>(['#3b82f6','#10b981','#facc15','#f43f5e','#a855f7']);
  const [tab, setTab] = useState<'Profile' | 'Preferences' | 'Security'>('Profile');
  // Security state
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean | null>(null);
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [twoFAOtpauth, setTwoFAOtpauth] = useState<string | null>(null);
  const [twoFAToken, setTwoFAToken] = useState('');
  const [securityBusy, setSecurityBusy] = useState(false);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const fetch2FA = async () => {
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

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      setLoading(true);
      try {
      const resp = await fetch('/api/settings');
        if (resp.ok) {
          const data = await resp.json();
          if (data.success && data.settings) {
            setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
            if (data.settings.chart_palette?.categorical) {
              setPaletteDraft(data.settings.chart_palette.categorical);
            }
          }
        }
      } catch (e) {
        console.error('Fetch settings error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
    fetch2FA();
  }, [user]);

  async function saveSettings() {
    if (!user) return;
    setSaving(true);
    try {
      const resp = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, chart_palette: { categorical: paletteDraft } }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          setSettings({ ...settings, ...data.settings });
        }
      }
    } catch (e) {
      console.error('Save settings error', e);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || loading) {
    return <div className="p-6">Loading settings...</div>;
  }
  if (!user) {
    return <div className="p-6">Please log in to manage settings.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⚙️ Settings</h1>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-2">
        {(['Profile','Preferences','Security'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-t-md ${tab===t ? 'bg-white dark:bg-gray-800 border border-b-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
          >{t}</button>
        ))}
      </div>

      {tab === 'Preferences' && (
      <div className="grid md:grid-cols-2 gap-8">
        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme Mode</label>
          <select
            className="w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm"
            value={settings.theme_mode}
            onChange={(e) => setSettings(s => ({ ...s, theme_mode: e.target.value as any }))}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
          <input
            type="text"
            className="w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm"
            value={settings.default_currency}
            onChange={(e) => setSettings(s => ({ ...s, default_currency: e.target.value.toUpperCase() }))}
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
            <select
              className="w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm"
              value={settings.date_format}
              onChange={(e) => setSettings(s => ({ ...s, date_format: e.target.value }))}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number Format</label>
          <select
            className="w-full rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-sm"
            value={settings.number_format}
            onChange={(e) => setSettings(s => ({ ...s, number_format: e.target.value as any }))}
          >
            <option value="standard">Standard</option>
            <option value="compact">Compact</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              id="notifications"
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) => setSettings(s => ({ ...s, notifications_enabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700 dark:text-gray-300">Enable Notifications</label>
          </div>
        </div>

        {/* Chart Palette */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chart Palette (RGB)</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Customize categorical colors used in charts. Paste hex or use color pickers.</p>
          <div className="space-y-2">
            {paletteDraft.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="color"
                  value={c}
                  onChange={(e) => setPaletteDraft(p => p.map((v,i) => i===idx ? e.target.value : v))}
                  className="h-8 w-12 rounded-md"
                />
                <input
                  type="text"
                  value={c}
                  onChange={(e) => setPaletteDraft(p => p.map((v,i) => i===idx ? e.target.value : v))}
                  className="flex-1 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-xs"
                />
                <button
                  onClick={() => setPaletteDraft(p => p.filter((_,i) => i!==idx))}
                  className="text-xs px-2 py-1 rounded-md bg-red-500 text-white"
                >Remove</button>
              </div>
            ))}
            <button
              onClick={() => setPaletteDraft(p => [...p, '#6b7280'])}
              className="text-sm px-3 py-2 rounded-md bg-blue-600 text-white"
            >Add Color</button>
          </div>
        </div>
      </div>
      )}
      {tab === 'Profile' && (
        <ProfileTab />
      )}
      {tab === 'Security' && (
        <SecurityTab
          twoFAEnabled={twoFAEnabled}
          twoFASecret={twoFASecret}
          twoFAOtpauth={twoFAOtpauth}
          onRefreshStatus={fetch2FA}
          setTwoFASecret={setTwoFASecret}
          setTwoFAOtpauth={setTwoFAOtpauth}
          twoFAToken={twoFAToken}
          setTwoFAToken={setTwoFAToken}
          securityBusy={securityBusy}
          setSecurityBusy={setSecurityBusy}
          pwd={pwd}
          setPwd={setPwd}
          pwdBusy={pwdBusy}
          setPwdBusy={setPwdBusy}
          pwdMsg={pwdMsg}
          setPwdMsg={setPwdMsg}
        />
      )}

      <div className="flex justify-end">
        <button
          disabled={saving}
          onClick={saveSettings}
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50"
        >{saving ? 'Saving...' : 'Save Settings'}</button>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', bio: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/profile');
        if (r.ok) {
          const d = await r.json();
          if (d.user) setForm({ name: d.user.name || '', phone: d.user.phone || '', bio: d.user.bio || '', avatar_url: d.user.avatar_url || '' });
        }
      } finally { setLoading(false); }
    };
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } finally { setSaving(false); }
  }

  async function uploadAvatar() {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const r = await fetch('/api/profile/avatar', { method: 'POST', body: fd });
      const d = await r.json();
      if (r.ok && d.success && d.url) {
        setForm(f => ({ ...f, avatar_url: d.url }));
        setFile(null);
      }
    } finally { setUploading(false); }
  }

  if (loading) return <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-sm text-gray-600 dark:text-gray-400">Loading profile...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <img src={form.avatar_url || `https://www.gravatar.com/avatar/${(user?.email || '').trim().toLowerCase()}`} alt="avatar" className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-700" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='https://via.placeholder.com/64?text=👤';}} />
          <div className="flex-1">
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Avatar URL</label>
            <input value={form.avatar_url} onChange={(e)=>setForm(f=>({...f,avatar_url:e.target.value}))} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm" placeholder="https://... (PNG/JPG/WebP) or /avatars/.." />
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Paste an image URL or use the local upload below.</div>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Upload local image</label>
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <button onClick={uploadAvatar} disabled={!file || uploading} className="px-3 py-2 text-sm rounded-md bg-green-600 text-white disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Email</label>
        <input disabled value={user?.email || ''} className="w-full rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-2 text-sm"/>
      </div>
      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Name</label>
        <input value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"/>
      </div>
      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Phone</label>
        <input value={form.phone} onChange={(e)=>setForm(f=>({...f,phone:e.target.value}))} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"/>
      </div>
      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Bio/Description</label>
        <textarea rows={4} value={form.bio} onChange={(e)=>setForm(f=>({...f,bio:e.target.value}))} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm"/>
      </div>
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
    </div>
  );
}

function SecurityTab(props: {
  twoFAEnabled: boolean | null;
  twoFASecret: string | null;
  twoFAOtpauth: string | null;
  onRefreshStatus: () => void;
  setTwoFASecret: (v: string | null) => void;
  setTwoFAOtpauth: (v: string | null) => void;
  twoFAToken: string;
  setTwoFAToken: (v: string) => void;
  securityBusy: boolean;
  setSecurityBusy: (v: boolean) => void;
  pwd: { current: string; next: string; confirm: string };
  setPwd: (v: { current: string; next: string; confirm: string }) => void;
  pwdBusy: boolean;
  setPwdBusy: (v: boolean) => void;
  pwdMsg: string | null;
  setPwdMsg: (v: string | null) => void;
}) {
  const {
    twoFAEnabled, twoFASecret, twoFAOtpauth, onRefreshStatus, setTwoFASecret, setTwoFAOtpauth,
    twoFAToken, setTwoFAToken, securityBusy, setSecurityBusy,
    pwd, setPwd, pwdBusy, setPwdBusy, pwdMsg, setPwdMsg,
  } = props;

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Regenerate QR when otpauth changes (e.g., after setup)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!twoFAOtpauth) {
          if (active) setQrDataUrl(null);
          return;
        }
        const lib = await ensureQrLib();
        if (lib?.toDataURL) {
          const url = await lib.toDataURL(twoFAOtpauth, { margin: 1, width: 200 });
          if (active) setQrDataUrl(url);
        }
      } catch (e) {
        console.error('QR generation failed', e);
      }
    })();
    return () => { active = false; };
  }, [twoFAOtpauth]);

  async function start2FA() {
    setSecurityBusy(true);
    try {
      const r = await fetch('/api/security/2fa/setup', { method: 'POST' });
      const d = await r.json();
      if (d.success) {
        setTwoFASecret(d.secret);
        setTwoFAOtpauth(d.otpauth);
        try {
          const lib = await ensureQrLib();
          if (lib?.toDataURL) {
            const dataUrl = await lib.toDataURL(d.otpauth, { margin: 1, width: 200 });
            setQrDataUrl(dataUrl);
          }
        } catch {}
      }
    } finally { setSecurityBusy(false); }
  }

  async function verify2FA() {
    if (!twoFAToken) return;
    setSecurityBusy(true);
    try {
      const r = await fetch('/api/security/2fa/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: twoFAToken }) });
      const d = await r.json();
      if (d.success) {
        setTwoFAToken('');
        setTwoFASecret(null);
        setTwoFAOtpauth(null);
        await onRefreshStatus();
      }
    } finally { setSecurityBusy(false); }
  }

  async function disable2FA() {
    setSecurityBusy(true);
    try {
      await fetch('/api/security/2fa/disable', { method: 'POST' });
      setTwoFASecret(null);
      setTwoFAOtpauth(null);
      setQrDataUrl(null);
      await onRefreshStatus();
    } finally { setSecurityBusy(false); }
  }

  async function changePassword() {
    setPwdMsg(null);
    if (!pwd.current || !pwd.next || pwd.next !== pwd.confirm) {
      setPwdMsg('Please fill all fields and ensure new passwords match.');
      return;
    }
    setPwdBusy(true);
    try {
      const r = await fetch('/api/security/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.next }) });
      const d = await r.json();
      if (r.ok && d.success) {
        setPwd({ current: '', next: '', confirm: '' });
        setPwdMsg('Password updated successfully.');
      } else {
        setPwdMsg(d.error || 'Failed to update password');
      }
    } finally { setPwdBusy(false); }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* 2FA */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Two‑Factor Authentication (TOTP)</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Use an authenticator app (Google Authenticator, Authy). We don’t email codes for TOTP—those are generated in your app.</p>
        {twoFAEnabled === null ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading 2FA status...</div>
        ) : twoFAEnabled ? (
          <div className="space-y-3">
            <div className="text-sm text-green-600">2FA is enabled for your account.</div>
            <RecoveryCodesSection />
            <button onClick={disable2FA} disabled={securityBusy} className="px-3 py-2 text-sm rounded-md bg-red-600 text-white disabled:opacity-50">{securityBusy ? 'Working...' : 'Disable 2FA'}</button>
          </div>
        ) : (
          <div className="space-y-3">
            {!twoFASecret ? (
              <button onClick={start2FA} disabled={securityBusy} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white disabled:opacity-50">{securityBusy ? 'Working...' : 'Set up 2FA'}</button>
            ) : (
              <div className="space-y-2">
                <ol className="list-decimal pl-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Open your authenticator app and add an account.</li>
                  <li>Scan the QR or paste the secret below.</li>
                  <li>Enter the first 6‑digit code to enable.</li>
                </ol>
                <div className="text-sm text-gray-700 dark:text-gray-300">Secret (keep private):</div>
                <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-xs break-all">{twoFASecret}</div>
                {qrDataUrl ? (
                  <div className="flex items-center gap-4">
                    <img src={qrDataUrl} alt="2FA QR" className="h-32 w-32 border border-gray-200 dark:border-gray-700 rounded-md bg-white p-1" />
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 break-all">Scan this QR in Google Authenticator, Authy, etc. If needed, use the secret above.</div>
                  </div>
                ) : twoFAOtpauth ? (
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 break-all">QR is generating… If it doesn’t appear, you can add using this link: {twoFAOtpauth}</div>
                ) : null}
                <div className="flex items-end gap-2 mt-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Enter 6‑digit code</label>
                    <input value={twoFAToken} onChange={(e)=>setTwoFAToken(e.target.value)} maxLength={6} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm tracking-widest" />
                  </div>
                  <button onClick={verify2FA} disabled={securityBusy || twoFAToken.length !== 6} className="px-3 py-2 text-sm rounded-md bg-green-600 text-white disabled:opacity-50">Verify & Enable</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
        {pwdMsg && <div className="text-xs p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">{pwdMsg}</div>}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
          <input type="password" value={pwd.current} onChange={(e)=>setPwd({...pwd, current: e.target.value})} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">New Password</label>
          <input type="password" value={pwd.next} onChange={(e)=>setPwd({...pwd, next: e.target.value})} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
          <input type="password" value={pwd.confirm} onChange={(e)=>setPwd({...pwd, confirm: e.target.value})} className="w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 text-sm" />
        </div>
        <div className="flex justify-end">
          <button onClick={changePassword} disabled={pwdBusy} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white disabled:opacity-50">{pwdBusy ? 'Updating...' : 'Update Password'}</button>
        </div>
      </div>
    </div>
  );
}

function RecoveryCodesSection() {
  const [busy, setBusy] = useState(false);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function generate() {
    setBusy(true); setMsg(null);
    try {
      const r = await fetch('/api/security/2fa/recovery/generate', { method: 'POST' });
      const d = await r.json();
      if (r.ok && d.success && Array.isArray(d.codes)) {
        setCodes(d.codes);
      } else {
        setMsg(d.error || 'Failed to generate codes');
      }
    } finally { setBusy(false); }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">Recovery Codes</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Use when you lose access to your authenticator. Each code can be used once.</div>
        </div>
        <button onClick={generate} disabled={busy} className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white disabled:opacity-50">{busy ? 'Working...' : 'Generate new'}</button>
      </div>
      {msg && <div className="mt-2 text-xs text-red-500">{msg}</div>}
      {codes && (
        <div className="mt-3 p-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-amber-600 mb-2">Save these now. They won’t be shown again.</div>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            {codes.map((c, i) => <div key={i} className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">{c}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

