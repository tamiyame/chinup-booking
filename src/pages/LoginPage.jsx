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
