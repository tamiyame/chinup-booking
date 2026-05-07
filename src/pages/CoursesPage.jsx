import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import PeriodRail from '../components/PeriodRail.jsx';
import StripCard from '../components/StripCard.jsx';
import CourseDrawer from '../components/CourseDrawer.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { api, buildPeriods, dateToPeriodId } from '../api.js';

export default function CoursesPage() {
  const toast = useToast();
  const periods = buildPeriods();
  const [activePeriod, setActivePeriod] = useState(dateToPeriodId(new Date()));
  const [courses, setCourses] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCourse, setOpenCourse] = useState(null);

  useEffect(() => { load(); }, [activePeriod]);

  async function load() {
    setLoading(true);
    try {
      const [cs, regs] = await Promise.all([
        api(`/api/courses?period_id=${activePeriod}`),
        api('/api/my/course-registrations').catch(() => []),
      ]);
      setCourses(cs);
      setMyRegs(regs);
    } catch (e) {
      toast(`載入失敗：${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  const myRegMap = new Map(myRegs.map(r => [r.course_id, r]));

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero */}
        <section className="hero">
          <span className="hero-eyebrow">💪 帶狀課程</span>
          <h1>每兩個月一期<br />每週固定上課</h1>
          <p>由專業教練設計的循環課表，整期 8 堂、每週同一時段。請假後額度可轉讓給朋友，請於開課前完成。</p>
        </section>

        {/* Period rail */}
        <section style={{ paddingBottom: 24 }}>
          <PeriodRail periods={periods} active={activePeriod} onPick={setActivePeriod} />
        </section>

        {/* Course list */}
        <section style={{ paddingBottom: 64 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">本期課表・週一至週六</h2>
            {!loading && <span className="subtle">共 {courses.length} 個帶狀課程</span>}
          </div>

          {loading ? (
            <SkeletonList />
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🗓️</span>
              <p>本期尚無課程</p>
              <p className="subtle mt-1">課程資訊稍後公布，請先瀏覽其他期數</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {courses.map(c => (
                <StripCard
                  key={c.id}
                  course={c}
                  myReg={myRegMap.get(c.id)}
                  onClick={() => setOpenCourse(c)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <CourseDrawer
        course={openCourse}
        myReg={openCourse ? myRegMap.get(openCourse.id) : null}
        periodId={activePeriod}
        onClose={() => setOpenCourse(null)}
        onRegistered={load}
        onCancelled={load}
      />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="grid gap-3">
      {[1,2,3,4].map(i => (
        <div key={i} className="strip-card" style={{ opacity: .6 }}>
          <div className="dow-block skeleton" style={{ height: 64 }} />
          <div>
            <div className="skeleton" style={{ height: 20, width: '55%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '80%' }} />
          </div>
          <div className="skeleton" style={{ height: 34, width: 90 }} />
        </div>
      ))}
    </div>
  );
}
