// Shared fixture data for all three 方案
window.DATA = (function () {
  const COACHES = [
    {
      id: 'c1', name: '陳冠宇 Kuan-Yu Chen', tagline: '競技表現・爆發力',
      bio: '前國家代表隊體能教練，專長運動員力量與速度發展。',
      cert: ['NSCA-CSCS', 'USAW-1', 'FMS-2'],
      tags: ['競技訓練', '爆發力', '速度敏捷'],
      rate: 1800, // per session NTD
    },
    {
      id: 'c2', name: '林映瑄 Ying-Hsuan Lin', tagline: '一般大眾・新手友善',
      bio: '專注於初學者課程設計，重訓動作優化與姿勢矯正。',
      cert: ['ACSM-CPT', 'FRC Mobility'],
      tags: ['新手入門', '動作矯正', 'TRX'],
      rate: 1500,
    },
    {
      id: 'c3', name: '黃志明 Chih-Ming Huang', tagline: '銀髮族・功能性訓練',
      bio: '針對 55+ 訓練設計，專業老人運動處方。',
      cert: ['NASM-SFS', '高齡運動指導員'],
      tags: ['銀髮訓練', '平衡訓練', '預防跌倒'],
      rate: 1500,
    },
    {
      id: 'c4', name: 'Jenny Wu', tagline: 'HIIT・燃脂塑形',
      bio: '高強度間歇訓練專業，循環體能課表規劃。',
      cert: ['ACE-CPT', 'TRX-STC'],
      tags: ['HIIT', '燃脂', '循環訓練'],
      rate: 1500,
    },
  ];

  // Periods: 1-2, 3-4, 5-6, 7-8, 9-10, 11-12
  const PERIODS = [
    { id: 'p1', label: '01–02 月', months: '一月・二月', status: 'past' },
    { id: 'p2', label: '03–04 月', months: '三月・四月', status: 'past' },
    { id: 'p3', label: '05–06 月', months: '五月・六月', status: 'current' },
    { id: 'p4', label: '07–08 月', months: '七月・八月', status: 'open' },
    { id: 'p5', label: '09–10 月', months: '九月・十月', status: 'soon' },
    { id: 'p6', label: '11–12 月', months: '十一月・十二月', status: 'soon' },
  ];

  // Weekly recurring courses (帶狀)
  const COURSES = [
    {
      id: 'r-mon', name: '重量訓練・進階', dow: 1, dowLabel: '一', time: '19:00',
      duration: 60, min: 3, max: 8, coach: 'c1',
      desc: '三大項加上輔助動作，建議 6 個月以上訓練經驗',
      tag: '進階', sessions: 8,
    },
    {
      id: 'r-tue', name: 'TRX 懸吊訓練', dow: 2, dowLabel: '二', time: '18:30',
      duration: 50, min: 4, max: 10, coach: 'c2',
      desc: '全身核心啟動，新手友善，動作可調整難度',
      tag: '入門', sessions: 8,
    },
    {
      id: 'r-wed', name: 'HIIT 高強度間歇', dow: 3, dowLabel: '三', time: '19:30',
      duration: 45, min: 5, max: 12, coach: 'c4',
      desc: '燃脂循環訓練，搭配心率監測，每組 30 秒',
      tag: '中階', sessions: 8,
    },
    {
      id: 'r-thu', name: '銀髮功能性訓練', dow: 4, dowLabel: '四', time: '10:00',
      duration: 45, min: 4, max: 12, coach: 'c3',
      desc: '針對 55+ 設計，平衡、肌力、靈活度循序漸進',
      tag: '銀髮', sessions: 8,
    },
    {
      id: 'r-fri', name: '競技體能・速度敏捷', dow: 5, dowLabel: '五', time: '20:00',
      duration: 60, min: 3, max: 6, coach: 'c1',
      desc: '需有運動專項背景，含跳躍、變向、衝刺訓練',
      tag: '進階', sessions: 8,
    },
    {
      id: 'r-sat', name: '初學重訓・基礎', dow: 6, dowLabel: '六', time: '10:30',
      duration: 60, min: 4, max: 8, coach: 'c2',
      desc: '從零開始，槓鈴與啞鈴的基本動作建立',
      tag: '入門', sessions: 8,
    },
  ];

  // User registrations for current period (5-6月)
  const MY_REGS = [
    {
      id: 'reg1', courseId: 'r-mon', period: 'p3',
      total: 8, attended: 5, upcoming: 2, leave: 1,
      transferable: 1, status: 'active',
    },
    {
      id: 'reg2', courseId: 'r-tue', period: 'p3',
      total: 8, attended: 4, upcoming: 4, leave: 0,
      transferable: 0, status: 'active',
    },
  ];

  // Single-session add-ons available
  const ADDONS = [
    { id: 'a1', courseId: 'r-wed', date: '2026/05/13', time: '19:30', price: 800, available: 4 },
    { id: 'a2', courseId: 'r-fri', date: '2026/05/15', time: '20:00', price: 900, available: 2 },
    { id: 'a3', courseId: 'r-sat', date: '2026/05/16', time: '10:30', price: 800, available: 6 },
  ];

  // Dates for the current week (mock = week of May 4-10, 2026)
  const WEEK = [
    { dow: 1, dowLabel: '一', date: '05/04' },
    { dow: 2, dowLabel: '二', date: '05/05' },
    { dow: 3, dowLabel: '三', date: '05/06' },
    { dow: 4, dowLabel: '四', date: '05/07' },
    { dow: 5, dowLabel: '五', date: '05/08' },
    { dow: 6, dowLabel: '六', date: '05/09' },
    { dow: 0, dowLabel: '日', date: '05/10' },
  ];

  // Coach available slots (for 1-on-1 booking)
  const SLOTS = {
    c1: [
      { date: '05/08', day: '週五', times: ['09:00', '10:00', '14:00', '15:00'] },
      { date: '05/09', day: '週六', times: ['08:00', '11:00', '14:00'] },
      { date: '05/11', day: '週一', times: ['10:00', '13:00', '16:00', '17:00'] },
      { date: '05/12', day: '週二', times: ['09:00', '14:00', '20:00'] },
    ],
    c2: [
      { date: '05/08', day: '週五', times: ['08:00', '11:00', '13:00'] },
      { date: '05/09', day: '週六', times: ['09:00', '15:00', '16:00'] },
      { date: '05/11', day: '週一', times: ['11:00', '14:00', '15:00', '19:00'] },
    ],
    c3: [
      { date: '05/08', day: '週五', times: ['09:00', '10:00', '11:00'] },
      { date: '05/12', day: '週二', times: ['09:00', '10:00', '11:00', '14:00'] },
    ],
    c4: [
      { date: '05/09', day: '週六', times: ['07:00', '13:00', '17:00'] },
      { date: '05/11', day: '週一', times: ['07:00', '12:00', '18:00', '19:00'] },
    ],
  };

  const coachById = (id) => COACHES.find(c => c.id === id);
  const courseById = (id) => COURSES.find(c => c.id === id);

  return { COACHES, COURSES, PERIODS, MY_REGS, ADDONS, WEEK, SLOTS, coachById, courseById };
})();
