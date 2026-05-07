import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    const fd = new FormData(e.target);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error === 'invalid_credentials' ? '帳號或密碼錯誤' : (data.error || '登入失敗'));
      localStorage.setItem('chinup.token', data.token);
      localStorage.setItem('chinup.user', JSON.stringify(data.user));
      setUser(data.user);
      navigate(['admin','owner'].includes(data.user.role) ? '/admin' : redirect, { replace: true });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs = {
          invalid_email: '電子郵件格式不正確',
          password_too_short: '密碼至少需 8 字元',
          missing_name: '請輸入姓名',
          email_exists: '此 Email 已被註冊',
        };
        throw new Error(msgs[data.error] || data.error || '註冊失敗');
      }
      localStorage.setItem('chinup.token', data.token);
      localStorage.setItem('chinup.user', JSON.stringify(data.user));
      setUser(data.user);
      navigate(redirect, { replace: true });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      backgroundImage:
        'radial-gradient(1200px 600px at 20% 10%, rgba(56,189,248,.18), transparent 55%),' +
        'radial-gradient(900px 500px at 90% 90%, rgba(14,165,233,.12), transparent 55%)',
    }}>
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/logo.png" alt="CHINUP Performance" className="login-logo" />
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {mode === 'login' ? '歡迎回來' : '建立新帳號'}
          </h1>
          <p className="subtle mt-1">
            {mode === 'login'
              ? '登入 CHINUP Performance 繼續報名課程'
              : '加入 CHINUP Performance 開始報名團體課程'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid var(--line)', marginBottom: 20 }}>
          <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setErr(''); }}>登入</button>
          <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setErr(''); }}>註冊新帳號</button>
        </div>

        {/* Google OAuth */}
        <a href="/api/auth/google" className="btn-google">
          <GoogleIcon />
          使用 Google 登入
        </a>

        <div className="divider">或</div>

        {/* Error */}
        {err && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{err}</div>}

        {/* Login form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field id="email" name="email" label="電子郵件" type="email" placeholder="you@example.com" autoComplete="email" />
            <Field id="password" name="password" label="密碼" type="password" placeholder="••••••••" autoComplete="current-password" />
            <button type="submit" className="btn btn-primary w-full" disabled={busy}>
              {busy ? '登入中…' : '登入'}
            </button>
          </form>
        )}

        {/* Register form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field id="r-name" name="name" label="姓名" type="text" placeholder="王小明" />
            <Field id="r-email" name="email" label="電子郵件" type="email" placeholder="you@example.com" autoComplete="email" />
            <Field id="r-phone" name="phone" label="手機（選填）" type="tel" placeholder="0912345678" />
            <Field id="r-password" name="password" label="密碼（至少 8 字元）" type="password" placeholder="••••••••" autoComplete="new-password" />
            <div>
              <label className="form-label" htmlFor="r-notif">通知方式</label>
              <select id="r-notif" name="notification_preference" className="form-select">
                <option value="email">Email</option>
                <option value="sms">簡訊</option>
                <option value="both">Email + 簡訊</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={busy}>
              {busy ? '建立中…' : '建立帳號'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ id, name, label, type, placeholder, autoComplete }) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} required className="form-input"
             placeholder={placeholder} autoComplete={autoComplete} />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
