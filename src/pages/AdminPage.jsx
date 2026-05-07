import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { api, fmtDate } from '../api.js';

const ROLE_LABEL   = { owner: '擁有者', admin: '管理者', user: '會員' };
const ROLE_BADGE   = { owner: 'waitlisted', admin: 'confirmed', user: 'open' };
const STATUS_BADGE = { open: 'open', confirmed: 'confirmed', cancelled: 'cancelled', completed: 'completed' };
const STATUS_LABEL = { open: '開放', confirmed: '已成班', cancelled: '未開課', completed: '結束' };

export default function AdminPage() {
  const toast = useToast();
  const [tab, setTab] = useState('templates');
  const [stats, setStats] = useState({ templates: '—', sessions: '—', regs: '—', waitlist: '—' });
  const [templates, setTemplates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewCourse, setShowNewCourse] = useState(false);

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    if (tab === 'templates') loadTemplates();
    if (tab === 'courses')   loadCourses();
    if (tab === 'users')     loadUsers();
  }, [tab]);

  async function loadStats() {
    try {
      const s = await api('/api/admin/stats');
      setStats(s);
    } catch {}
  }

  async function loadTemplates() {
    setLoading(true);
    try {
      setTemplates(await api('/api/admin/templates'));
    } catch (e) {
      toast(`載入失敗：${e.message}`, 'error');
    } finally { setLoading(false); }
  }

  async function loadCourses() {
    setLoading(true);
    try {
      setCourses(await api('/api/admin/courses'));
    } catch (e) {
      toast(`載入失敗：${e.message}`, 'error');
    } finally { setLoading(false); }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      setUsers(await api('/api/admin/users'));
    } catch (e) {
      toast(`載入失敗：${e.message}`, 'error');
    } finally { setLoading(false); }
  }

  async function handlePublishCourse(id, current) {
    try {
      await api(`/api/admin/courses/${id}`, { method: 'PATCH', body: { status: current === 'published' ? 'draft' : 'published' } });
      toast('已更新', 'success');
      loadCourses();
    } catch (e) { toast(e.message, 'error'); }
  }

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        <section className="hero">
          <span className="hero-eyebrow">⚙️ Admin Console</span>
          <h1>管理後台</h1>
          <p>管理帶狀課程、一對一教練、報名狀態及會員資料。</p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          <StatBox label="課程範本" value={stats.templates} />
          <StatBox label="帶狀課程" value={stats.courses ?? '—'} />
          <StatBox label="報名人次" value={stats.regs} />
          <StatBox label="候補人次" value={stats.waitlist} accent />
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
          {[
            { id: 'templates', label: '課程範本' },
            { id: 'courses',   label: '帶狀課程' },
            { id: 'users',     label: '會員管理' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 16px', background: 'transparent', border: 'none',
                borderBottom: `2px solid ${tab === t.id ? 'var(--brand-600)' : 'transparent'}`,
                color: tab === t.id ? 'var(--brand-700)' : 'var(--ink-soft)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 160ms',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'templates' && (
          <TemplatesTab templates={templates} loading={loading} onRefresh={loadTemplates} toast={toast} />
        )}
        {tab === 'courses' && (
          <CoursesTab
            courses={courses} loading={loading}
            onPublish={handlePublishCourse}
            showNew={showNewCourse} setShowNew={setShowNewCourse}
            onRefresh={loadCourses} toast={toast}
          />
        )}
        {tab === 'users' && (
          <UsersTab users={users} loading={loading} />
        )}
      </main>
    </div>
  );
}

function StatBox({ label, value, accent }) {
  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4, letterSpacing: '-0.03em', color: accent ? '#a16207' : 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}

function TemplatesTab({ templates, loading, onRefresh, toast }) {
  const [showNew, setShowNew] = useState(false);

  async function handleDelete(id) {
    if (!confirm('確定刪除此範本及其所有場次？')) return;
    try {
      await api(`/api/admin/templates/${id}`, { method: 'DELETE' });
      toast('已刪除', 'success');
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
  }

  if (loading) return <div className="card skeleton" style={{ height: 200 }} />;

  return (
    <section style={{ paddingBottom: 48 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">課程範本</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>＋ 新增範本</button>
      </div>
      {templates.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📚</span>
          <p>尚無課程範本</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {templates.map(t => (
            <article key={t.id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="card-title">{t.name}</h3>
                    <span className={`badge badge-${t.status === 'published' ? 'confirmed' : 'completed'}`}>
                      {t.status === 'published' ? '已發布' : t.status}
                    </span>
                  </div>
                  <p className="card-desc">{t.description}</p>
                  <div className="meta" style={{ marginTop: 8 }}>
                    <span className="meta-item">⏱ {t.duration_minutes} 分鐘</span>
                    <span className="meta-item">👥 {t.min_capacity}–{t.max_capacity} 人</span>
                    {t.recurrence && <span className="meta-item">🔄 {t.recurrence}</span>}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t.id)}>刪除</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {showNew && <NewTemplateModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); onRefresh(); }} toast={toast} />}
    </section>
  );
}

function CoursesTab({ courses, loading, onPublish, showNew, setShowNew, onRefresh, toast }) {
  if (loading) return <div className="card skeleton" style={{ height: 200 }} />;

  return (
    <section style={{ paddingBottom: 48 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">帶狀課程</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>＋ 新增課程</button>
      </div>
      {courses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🗓️</span>
          <p>尚無帶狀課程</p>
        </div>
      ) : (
        <div className="card p-0" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>課程名稱</th>
                <th>時段</th>
                <th>教練</th>
                <th>期數</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td className="text-tabular">週{c.dow_label} {c.time}</td>
                  <td>{c.coach_name ?? '—'}</td>
                  <td>{c.period_label ?? '—'}</td>
                  <td>
                    <span className={`badge badge-${STATUS_BADGE[c.status] ?? 'open'}`}>
                      {STATUS_LABEL[c.status] ?? c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onPublish(c.id, c.status)}
                    >
                      {c.status === 'published' ? '下架' : '發布'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showNew && (
        <NewCourseModal
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); onRefresh(); }}
          toast={toast}
        />
      )}
    </section>
  );
}

function UsersTab({ users, loading }) {
  if (loading) return <div className="card skeleton" style={{ height: 200 }} />;
  return (
    <section style={{ paddingBottom: 48 }}>
      <h2 className="section-title mb-4">會員管理</h2>
      <div className="card p-0" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>Email</th>
              <th>角色</th>
              <th>加入日期</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge badge-${ROLE_BADGE[u.role] ?? 'open'}`}>
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                </td>
                <td className="text-tabular" style={{ color: 'var(--ink-soft)' }}>{fmtDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NewTemplateModal({ onClose, onCreated, toast }) {
  const [busy, setBusy] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const body = Object.fromEntries(new FormData(e.target).entries());
    body.min_capacity = Number(body.min_capacity);
    body.max_capacity = Number(body.max_capacity);
    body.duration_minutes = Number(body.duration_minutes);
    try {
      await api('/api/admin/templates', { method: 'POST', body });
      toast('已建立課程範本', 'success');
      onCreated();
    } catch (e2) { toast(e2.message, 'error'); } finally { setBusy(false); }
  }
  return (
    <ModalShell title="新增課程範本" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AdminField name="name" label="課程名稱" required />
        <AdminField name="description" label="課程描述" />
        <div className="grid grid-cols-3 gap-3">
          <AdminField name="duration_minutes" label="時長（分鐘）" type="number" defaultValue="60" required />
          <AdminField name="min_capacity" label="最少人數" type="number" defaultValue="3" required />
          <AdminField name="max_capacity" label="最多人數" type="number" defaultValue="10" required />
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '建立中…' : '建立'}</button>
        </div>
      </form>
    </ModalShell>
  );
}

function NewCourseModal({ onClose, onCreated, toast }) {
  const [busy, setBusy] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const body = Object.fromEntries(new FormData(e.target).entries());
    body.dow = Number(body.dow);
    body.sessions_per_period = Number(body.sessions_per_period);
    body.price_per_period = Number(body.price_per_period);
    try {
      await api('/api/admin/courses', { method: 'POST', body });
      toast('已建立帶狀課程', 'success');
      onCreated();
    } catch (e2) { toast(e2.message, 'error'); } finally { setBusy(false); }
  }
  return (
    <ModalShell title="新增帶狀課程" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AdminField name="name" label="課程名稱" required />
        <AdminField name="description" label="課程描述" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">星期幾</label>
            <select name="dow" className="form-select" required>
              {['日','一','二','三','四','五','六'].map((d,i) => (
                <option key={i} value={i}>週{d}</option>
              ))}
            </select>
          </div>
          <AdminField name="time" label="時段（如 19:00）" placeholder="19:00" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminField name="sessions_per_period" label="每期堂數" type="number" defaultValue="8" required />
          <AdminField name="price_per_period" label="整期費用（NT$）" type="number" defaultValue="8800" required />
        </div>
        <AdminField name="tag" label="分類標籤（如：進階）" />
        <div className="flex gap-2 justify-end mt-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>取消</button>
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '建立中…' : '建立'}</button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AdminField({ name, label, type = 'text', placeholder, required, defaultValue }) {
  return (
    <div>
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        id={name} name={name} type={type} className="form-input"
        placeholder={placeholder} required={required} defaultValue={defaultValue}
      />
    </div>
  );
}
