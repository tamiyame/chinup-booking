// 後端 API 自動化驗證
const API = 'http://localhost:3000';

const results = [];
let pass = 0, fail = 0;

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    pass++;
  } catch (e) {
    results.push({ name, ok: false, err: e.message });
    fail++;
  }
}

function expect(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function get(path) {
  const r = await fetch(API + path);
  expect(r.ok, `GET ${path} → ${r.status}`);
  return r.json();
}

async function post(path, body) {
  const r = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  expect(r.ok, `POST ${path} → ${r.status}`);
  return r.json();
}

async function del(path) {
  const r = await fetch(API + path, { method: 'DELETE' });
  expect(r.ok, `DELETE ${path} → ${r.status}`);
  return r.json();
}

// ---- AUTH ----
await check('POST /api/auth/login', async () => {
  const d = await post('/api/auth/login', { email: 'a@b.c', password: 'x' });
  expect(d.token, 'no token');
  expect(d.user?.name, 'no user.name');
});

await check('GET /api/auth/me', async () => {
  const d = await get('/api/auth/me');
  expect(d.id, 'no id');
  expect(d.name, 'no name');
});

await check('POST /api/auth/logout', async () => {
  const d = await post('/api/auth/logout');
  expect(d.ok, 'no ok');
});

// ---- COURSES ----
await check('GET /api/courses', async () => {
  const d = await get('/api/courses?period_id=p3');
  expect(Array.isArray(d), 'not array');
  expect(d.length === 6, `expected 6 courses, got ${d.length}`);
  const c = d[0];
  expect(c.id && c.name && c.dow_label && c.time, 'missing fields');
  expect(c.coach_name, 'no coach_name');
  expect(c.sessions_per_period === 8, 'sessions != 8');
  expect(c.price_per_period > 0, 'no price');
});

await check('POST /api/courses/:id/register', async () => {
  const d = await post('/api/courses/1/register', { period_id: 'p3' });
  expect(d.id, 'no id');
  expect(d.status === 'confirmed' || d.status === 'waitlisted', 'bad status');
});

// ---- MY REGISTRATIONS ----
await check('GET /api/my/course-registrations', async () => {
  const d = await get('/api/my/course-registrations?period_id=p3');
  expect(Array.isArray(d), 'not array');
  expect(d.length === 2, `expected 2 regs, got ${d.length}`);
  const r = d[0];
  expect(r.total === 8, 'total != 8');
  expect(typeof r.attended === 'number', 'no attended');
  expect(typeof r.leave === 'number', 'no leave');
  expect(typeof r.upcoming === 'number', 'no upcoming');
  expect(r.attended + r.leave + r.upcoming === r.total, 'progress sum mismatch');
});

await check('GET my-regs filter empty period', async () => {
  const d = await get('/api/my/course-registrations?period_id=p1');
  expect(Array.isArray(d), 'not array');
  expect(d.length === 0, `expected 0 regs for past period, got ${d.length}`);
});

await check('DELETE /api/registrations/:id', async () => {
  const d = await del('/api/registrations/101');
  expect(d.ok, 'no ok');
});

await check('POST /api/registrations/:id/transfer', async () => {
  const d = await post('/api/registrations/101/transfer', { recipient: 'foo@example.com' });
  expect(d.ok, 'no ok');
});

// ---- ADDONS ----
await check('GET /api/addons', async () => {
  const d = await get('/api/addons?period_id=p3');
  expect(Array.isArray(d), 'not array');
  expect(d.length === 2, `expected 2 addons, got ${d.length}`);
  const a = d[0];
  expect(a.course_name && a.date && a.time && a.price, 'missing addon fields');
});

await check('POST /api/addons/:id/register', async () => {
  const d = await post('/api/addons/1/register');
  expect(d.ok, 'no ok');
});

// ---- COACHES ----
await check('GET /api/coaches', async () => {
  const d = await get('/api/coaches');
  expect(Array.isArray(d), 'not array');
  expect(d.length === 4, `expected 4 coaches, got ${d.length}`);
  const c = d[0];
  expect(c.id && c.name && c.tagline && c.bio, 'missing coach fields');
  expect(Array.isArray(c.tags), 'tags not array');
  expect(Array.isArray(c.certifications), 'certifications not array');
  expect(c.rate_per_session > 0, 'no rate');
});

await check('GET /api/coaches/:id', async () => {
  const d = await get('/api/coaches/c1');
  expect(d.id === 'c1', 'wrong id');
  expect(d.name?.includes('陳冠宇'), 'wrong coach');
});

await check('GET /api/coaches/:id 404', async () => {
  const r = await fetch(API + '/api/coaches/c999');
  expect(r.status === 404, `expected 404, got ${r.status}`);
});

await check('GET /api/coaches/:id/slots', async () => {
  const d = await get('/api/coaches/c1/slots');
  expect(Array.isArray(d), 'not array');
  expect(d.length > 0, 'no slots');
  const s = d[0];
  expect(s.date && s.day_label && Array.isArray(s.times), 'missing slot fields');
  expect(s.times.length > 0, 'no times');
});

await check('POST /api/coaches/:id/book', async () => {
  const d = await post('/api/coaches/c1/book', { date: '05/08', time: '14:00' });
  expect(d.id, 'no id');
  expect(d.invite_sent, 'no invite_sent');
});

// ---- ADMIN ----
await check('GET /api/admin/stats', async () => {
  const d = await get('/api/admin/stats');
  expect(typeof d.regs === 'number', 'no regs');
  expect(typeof d.waitlist === 'number', 'no waitlist');
});

await check('GET /api/admin/templates', async () => {
  const d = await get('/api/admin/templates');
  expect(Array.isArray(d), 'not array');
  expect(d.length > 0, 'no templates');
});

await check('GET /api/admin/courses', async () => {
  const d = await get('/api/admin/courses');
  expect(Array.isArray(d), 'not array');
  expect(d[0].period_label, 'no period_label');
});

await check('GET /api/admin/users', async () => {
  const d = await get('/api/admin/users');
  expect(Array.isArray(d), 'not array');
  expect(d.length >= 2, 'no users');
});

// ---- 404 ----
await check('unknown route → 404', async () => {
  const r = await fetch(API + '/api/nonexistent');
  expect(r.status === 404, `expected 404, got ${r.status}`);
});

// ---- Output ----
console.log('\n=== API Test Results ===\n');
for (const r of results) {
  console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.err ? '  → ' + r.err : ''}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
