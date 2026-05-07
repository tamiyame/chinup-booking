// Quick mock API server — serves design fixture data for local preview
import http from 'http';

const COACHES = [
  { id: 'c1', name: '陳冠宇 Kuan-Yu Chen', tagline: '競技表現・爆發力', bio: '前國家代表隊體能教練，專長運動員力量與速度發展。', certifications: ['NSCA-CSCS', 'USAW-1', 'FMS-2'], tags: ['競技訓練', '爆發力', '速度敏捷'], rate_per_session: 1800, photo_url: null },
  { id: 'c2', name: '林映瑄 Ying-Hsuan Lin', tagline: '一般大眾・新手友善', bio: '專注於初學者課程設計，重訓動作優化與姿勢矯正。', certifications: ['ACSM-CPT', 'FRC Mobility'], tags: ['新手入門', '動作矯正', 'TRX'], rate_per_session: 1500, photo_url: null },
  { id: 'c3', name: '黃志明 Chih-Ming Huang', tagline: '銀髮族・功能性訓練', bio: '針對 55+ 訓練設計，專業老人運動處方。', certifications: ['NASM-SFS', '高齡運動指導員'], tags: ['銀髮訓練', '平衡訓練', '預防跌倒'], rate_per_session: 1500, photo_url: null },
  { id: 'c4', name: 'Jenny Wu', tagline: 'HIIT・燃脂塑形', bio: '高強度間歇訓練專業，循環體能課表規劃。', certifications: ['ACE-CPT', 'TRX-STC'], tags: ['HIIT', '燃脂', '循環訓練'], rate_per_session: 1500, photo_url: null },
];

const COURSES = [
  { id: 1, name: '重量訓練・進階', description: '三大項加上輔助動作，建議 6 個月以上訓練經驗', dow: 1, dow_label: '一', time: '19:00', duration_minutes: 60, min_capacity: 3, max_capacity: 8, sessions_per_period: 8, price_per_period: 8800, tag: '進階', coach_name: '陳冠宇', coach_tagline: '競技表現・爆發力', status: 'published' },
  { id: 2, name: 'TRX 懸吊訓練', description: '全身核心啟動，新手友善，動作可調整難度', dow: 2, dow_label: '二', time: '18:30', duration_minutes: 50, min_capacity: 4, max_capacity: 10, sessions_per_period: 8, price_per_period: 8000, tag: '入門', coach_name: '林映瑄', coach_tagline: '一般大眾・新手友善', status: 'published' },
  { id: 3, name: 'HIIT 高強度間歇', description: '燃脂循環訓練，搭配心率監測，每組 30 秒', dow: 3, dow_label: '三', time: '19:30', duration_minutes: 45, min_capacity: 5, max_capacity: 12, sessions_per_period: 8, price_per_period: 7600, tag: '中階', coach_name: 'Jenny Wu', coach_tagline: 'HIIT・燃脂塑形', status: 'published' },
  { id: 4, name: '銀髮功能性訓練', description: '針對 55+ 設計，平衡、肌力、靈活度循序漸進', dow: 4, dow_label: '四', time: '10:00', duration_minutes: 45, min_capacity: 4, max_capacity: 12, sessions_per_period: 8, price_per_period: 7200, tag: '銀髮', coach_name: '黃志明', coach_tagline: '銀髮族・功能性訓練', status: 'published' },
  { id: 5, name: '競技體能・速度敏捷', description: '需有運動專項背景，含跳躍、變向、衝刺訓練', dow: 5, dow_label: '五', time: '20:00', duration_minutes: 60, min_capacity: 3, max_capacity: 6, sessions_per_period: 8, price_per_period: 9200, tag: '進階', coach_name: '陳冠宇', coach_tagline: '競技表現・爆發力', status: 'published' },
  { id: 6, name: '初學重訓・基礎', description: '從零開始，槓鈴與啞鈴的基本動作建立', dow: 6, dow_label: '六', time: '10:30', duration_minutes: 60, min_capacity: 4, max_capacity: 8, sessions_per_period: 8, price_per_period: 8000, tag: '入門', coach_name: '林映瑄', coach_tagline: '一般大眾・新手友善', status: 'published' },
];

const MY_REGS = [
  { id: 101, course_id: 1, course_name: '重量訓練・進階', period_id: 'p3', status: 'active', dow_label: '一', time: '19:00', coach_name: '陳冠宇', total: 8, attended: 5, upcoming: 2, leave: 1, transferable: 1 },
  { id: 102, course_id: 2, course_name: 'TRX 懸吊訓練',  period_id: 'p3', status: 'active', dow_label: '二', time: '18:30', coach_name: '林映瑄', total: 8, attended: 4, upcoming: 4, leave: 0, transferable: 0 },
];

const ADDONS = [
  { id: 1, course_id: 3, course_name: 'HIIT 高強度間歇', date: '2026/05/13', dow_label: '三', time: '19:30', price: 800, available: 4 },
  { id: 2, course_id: 5, course_name: '競技體能・速度敏捷', date: '2026/05/15', dow_label: '五', time: '20:00', price: 900, available: 2 },
];

const SLOTS = {
  c1: [
    { date: '05/08', day_label: '週五', times: ['09:00','10:00','14:00','15:00'] },
    { date: '05/09', day_label: '週六', times: ['08:00','11:00','14:00'] },
    { date: '05/11', day_label: '週一', times: ['10:00','13:00','16:00','17:00'] },
    { date: '05/12', day_label: '週二', times: ['09:00','14:00','20:00'] },
  ],
  c2: [
    { date: '05/08', day_label: '週五', times: ['08:00','11:00','13:00'] },
    { date: '05/09', day_label: '週六', times: ['09:00','15:00','16:00'] },
    { date: '05/11', day_label: '週一', times: ['11:00','14:00','15:00','19:00'] },
  ],
  c3: [
    { date: '05/08', day_label: '週五', times: ['09:00','10:00','11:00'] },
    { date: '05/12', day_label: '週二', times: ['09:00','10:00','11:00','14:00'] },
  ],
  c4: [
    { date: '05/09', day_label: '週六', times: ['07:00','13:00','17:00'] },
    { date: '05/11', day_label: '週一', times: ['07:00','12:00','18:00','19:00'] },
  ],
};

const MOCK_USER = { id: 1, name: '王小明', email: 'wang@example.com', role: 'user' };
const MOCK_TOKEN = 'mock-token-dev';

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE' });
    return res.end();
  }

  const u = new URL(req.url, 'http://localhost:3000');
  const path = u.pathname;
  const period = u.searchParams.get('period_id') || 'p3';

  // Auth
  if (path === '/api/auth/me') return json(res, MOCK_USER);
  if (path === '/api/auth/login') return json(res, { token: MOCK_TOKEN, user: MOCK_USER });
  if (path === '/api/auth/register') return json(res, { token: MOCK_TOKEN, user: MOCK_USER });
  if (path === '/api/auth/logout') return json(res, { ok: true });

  // Mock Google OAuth — redirect back to root with token in hash (matches real flow)
  if (path === '/api/auth/google') {
    res.writeHead(302, { Location: `/#token=${MOCK_TOKEN}` });
    return res.end();
  }

  // Courses
  if (path === '/api/courses') return json(res, COURSES);

  const courseRegMatch = path.match(/^\/api\/courses\/(\d+)\/register$/);
  if (courseRegMatch) {
    return json(res, { id: Math.floor(Math.random() * 1000), status: 'confirmed' });
  }

  // My registrations
  if (path === '/api/my/course-registrations') {
    return json(res, MY_REGS.filter(r => r.period_id === period));
  }
  if (path === '/api/my/registrations') return json(res, []);

  const cancelMatch = path.match(/^\/api\/registrations\/(\d+)$/);
  if (cancelMatch && req.method === 'DELETE') return json(res, { ok: true });

  const transferMatch = path.match(/^\/api\/registrations\/(\d+)\/transfer$/);
  if (transferMatch) return json(res, { ok: true });

  // Add-ons
  if (path === '/api/addons') return json(res, ADDONS);
  const addonRegMatch = path.match(/^\/api\/addons\/(\d+)\/register$/);
  if (addonRegMatch) return json(res, { ok: true });

  // Coaches
  if (path === '/api/coaches') return json(res, COACHES);
  const coachMatch = path.match(/^\/api\/coaches\/(c\d+)$/);
  if (coachMatch) {
    const c = COACHES.find(x => x.id === coachMatch[1]);
    return c ? json(res, c) : json(res, { error: 'not_found' }, 404);
  }
  const slotsMatch = path.match(/^\/api\/coaches\/(c\d+)\/slots$/);
  if (slotsMatch) return json(res, SLOTS[slotsMatch[1]] || []);
  const bookMatch = path.match(/^\/api\/coaches\/(c\d+)\/book$/);
  if (bookMatch) return json(res, { id: 99, gcal_event_id: 'mock-gcal-id', invite_sent: true });

  // Admin
  if (path === '/api/admin/stats') return json(res, { templates: 3, courses: 6, regs: 42, waitlist: 5 });
  if (path === '/api/admin/templates') return json(res, COURSES.map(c => ({ ...c, status: 'published', recurrence: 'weekly' })));
  if (path === '/api/admin/courses') return json(res, COURSES.map(c => ({ ...c, period_label: '05–06 月', status: 'published' })));
  const adminCoursePatch = path.match(/^\/api\/admin\/courses\/(\d+)$/);
  if (adminCoursePatch) return json(res, { ok: true });
  if (path === '/api/admin/users') return json(res, [
    { id: 1, name: '王小明', email: 'wang@example.com', role: 'user', created_at: '2026-01-15T10:00:00Z' },
    { id: 2, name: 'Admin', email: 'admin@chinup.com', role: 'admin', created_at: '2025-12-01T10:00:00Z' },
  ]);

  json(res, { error: 'not_found' }, 404);
});

server.listen(3000, () => console.log('Mock API running on http://localhost:3000'));
