const DOW_EN = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

export default function StripCard({ course, onClick, myReg }) {
  return (
    <div className="strip-card" onClick={onClick} role="button" tabIndex={0}
         onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="dow-block">
        <div className="dow-zh">{course.dow_label}</div>
        <div className="dow-en">{DOW_EN[course.dow] ?? ''}</div>
      </div>

      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="sc-title">{course.name}</h3>
          {course.tag && <span className="tag-chip">{course.tag}</span>}
          {myReg && <span className="badge badge-confirmed">已報名</span>}
        </div>
        <div className="sc-desc">{course.description}</div>
        <div className="sc-meta">
          <span>🕐 {course.time}・{course.duration_minutes} 分鐘</span>
          <span>👥 {course.min_capacity}–{course.max_capacity} 人</span>
          {course.coach_name && <span>👨‍🏫 {course.coach_name}</span>}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {myReg ? (
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>本期進度</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em' }} className="text-tabular">
              {myReg.attended ?? 0} / {myReg.total ?? course.sessions_per_period}
            </div>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={e => { e.stopPropagation(); onClick(); }}
          >
            查看詳情
          </button>
        )}
      </div>
    </div>
  );
}
