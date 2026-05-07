const TOKEN_KEY = 'chinup.token';
const USER_KEY  = 'chinup.user';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}
export function setUser(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (res.status === 401) {
    clearAuth();
    location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    throw new Error('unauthenticated');
  }
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ---- Auth ----
export async function bootAuth() {
  const token = getToken();
  if (!token) return null;
  try {
    const user = await api('/api/auth/me');
    setUser(user);
    return user;
  } catch {
    return null;
  }
}

// ---- Date helpers ----
const DOW_ZH = ['日','一','二','三','四','五','六'];
export function dowLabel(n) { return `週${DOW_ZH[n]}`; }

export function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export function addOneHour(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Map a Date to its period id
export function dateToPeriodId(date) {
  const month = (date instanceof Date ? date : new Date(date)).getMonth() + 1;
  if (month <= 2)  return 'p1';
  if (month <= 4)  return 'p2';
  if (month <= 6)  return 'p3';
  if (month <= 8)  return 'p4';
  if (month <= 10) return 'p5';
  return 'p6';
}

// Static period definitions (always the same 6 periods per year)
export function buildPeriods(year = new Date().getFullYear()) {
  const now = new Date();
  const currentPeriod = dateToPeriodId(now);
  const periods = [
    { id: 'p1', label: '01–02 月', months: '一月・二月', startMonth: 1, endMonth: 2 },
    { id: 'p2', label: '03–04 月', months: '三月・四月', startMonth: 3, endMonth: 4 },
    { id: 'p3', label: '05–06 月', months: '五月・六月', startMonth: 5, endMonth: 6 },
    { id: 'p4', label: '07–08 月', months: '七月・八月', startMonth: 7, endMonth: 8 },
    { id: 'p5', label: '09–10 月', months: '九月・十月', startMonth: 9, endMonth: 10 },
    { id: 'p6', label: '11–12 月', months: '十一月・十二月', startMonth: 11, endMonth: 12 },
  ];
  return periods.map(p => ({
    ...p,
    status: p.id < currentPeriod ? 'past'
          : p.id === currentPeriod ? 'current'
          : p.id === nextPeriod(currentPeriod) ? 'open'
          : 'soon',
  }));
}

function nextPeriod(id) {
  const order = ['p1','p2','p3','p4','p5','p6'];
  const i = order.indexOf(id);
  return order[(i + 1) % 6] || 'p1';
}
