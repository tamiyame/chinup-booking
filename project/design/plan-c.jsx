/* eslint-disable */
// 方案 C — Editorial / Magazine
// Dark hero, large editorial photo cards (placeholder grids — real
// assets will replace), each course gets number + tag treatment.
// 1-on-1: full-bleed coach detail page with embedded "GCal-styled"
// custom calendar.

const { useState: useStateC, useMemo: useMemoC } = React;

function PlanC_Nav({ active, onNav }) {
  const links = [
    { id: 'home', label: '本期課程' },
    { id: 'oneonone', label: '私人教練' },
    { id: 'mine', label: '我的進度' },
  ];
  return (
    <nav style={{
      borderBottom: '1px solid var(--line)',
      background: 'var(--surface)',
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div className="max-w-6xl mx-auto px-6" style={{height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div className="flex items-center gap-10">
          <a href="#" onClick={(e) => e.preventDefault()} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontWeight: 800, fontSize: 16, color: 'var(--ink)',
            textDecoration: 'none', letterSpacing: '-0.02em',
          }}>
            <span style={{width: 30, height: 30, display: 'grid', placeItems: 'center'}}>
              <img src="assets/logo.png" alt="logo" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
            </span>
            CHIN-UP <span style={{color: 'var(--ink-mute)', fontWeight: 500}}>/ PERFORMANCE</span>
          </a>
          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a key={l.id} onClick={(e) => { e.preventDefault(); onNav(l.id); }}
                 href="#"
                 style={{
                   fontSize: 13, fontWeight: 600,
                   letterSpacing: '0.02em',
                   color: active === l.id ? 'var(--ink)' : 'var(--ink-soft)',
                   borderBottom: active === l.id ? '2px solid var(--ink)' : '2px solid transparent',
                   paddingBottom: 4,
                   transition: 'all 160ms ease',
                 }}>{l.label}</a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span style={{fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 9999, background: '#f1f5f9', color: 'var(--ink-soft)', letterSpacing: '0.02em'}}>
            05–06 / 2026
          </span>
          <button className="btn btn-ghost btn-sm">王小明</button>
        </div>
      </div>
    </nav>
  );
}

function MagPhoto({ tag, num, hue }) {
  // Decorative placeholder; real photo would replace.
  return (
    <div className="mag-photo" style={{
      background: `linear-gradient(135deg, hsl(${hue}, 30%, 14%), hsl(${(hue+30)%360}, 25%, 22%))`,
    }}>
      <div className="mp-grid"></div>
      <span className="mp-tag">{tag}</span>
      <div className="mp-num">{num}</div>
    </div>
  );
}

function PlanC_Home({ onPickCourse, registered }) {
  const { COURSES, PERIODS } = window.DATA;
  return (
    <main className="max-w-6xl mx-auto px-6" style={{paddingTop: 32, paddingBottom: 80}}>
      {/* Editorial hero */}
      <div className="mag-hero">
        <span className="mh-eyebrow">2026 / Spring Term · 5–6 月期</span>
        <h1>循環體能課表<br/>第 III 期</h1>
        <p>每兩個月一期、每週同一時段，由教練設計循序漸進的訓練計畫。</p>
        <div style={{position: 'relative', display: 'flex', gap: 24, marginTop: 28}}>
          <div>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase'}}>本期週數</div>
            <div style={{fontSize: 32, fontWeight: 800, color: 'white', marginTop: 4, letterSpacing: '-0.03em'}}>第 1 / 8 週</div>
          </div>
          <div style={{width: 1, background: 'rgba(255,255,255,0.15)'}}></div>
          <div>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase'}}>本期課程</div>
            <div style={{fontSize: 32, fontWeight: 800, color: 'white', marginTop: 4, letterSpacing: '-0.03em'}}>{COURSES.length} 個帶狀</div>
          </div>
          <div style={{width: 1, background: 'rgba(255,255,255,0.15)'}}></div>
          <div>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase'}}>已報名</div>
            <div style={{fontSize: 32, fontWeight: 800, color: 'white', marginTop: 4, letterSpacing: '-0.03em'}}>{registered.length} / {COURSES.length}</div>
          </div>
        </div>
      </div>

      {/* Period horizontal nav */}
      <div style={{display: 'flex', gap: 24, marginTop: 36, marginBottom: 28, borderBottom: '1px solid var(--line)', paddingBottom: 14}}>
        {PERIODS.map(p => (
          <button key={p.id} style={{
            fontSize: 13, fontWeight: 600,
            color: p.status === 'current' ? 'var(--ink)' : 'var(--ink-mute)',
            background: 'transparent', border: 'none',
            borderBottom: p.status === 'current' ? '2px solid var(--ink)' : 'none',
            padding: '0 0 14px 0', marginBottom: -15,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}>
            {p.label}
            <span style={{fontSize: 11, marginLeft: 8, color: 'var(--ink-mute)', fontWeight: 500}}>
              {p.status === 'past' ? '已結束' : p.status === 'current' ? '進行中' : p.status === 'open' ? '報名中' : '尚未開放'}
            </span>
          </button>
        ))}
      </div>

      {/* Section title */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)'}}>This Term · 帶狀課程</div>
          <h2 style={{fontSize: 32, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em'}}>每週開課 · {COURSES.length} 種訓練主題</h2>
        </div>
        <div className="text-sm text-soft">滑動瀏覽 →</div>
      </div>

      {/* Course grid */}
      <div className="grid gap-5" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'}}>
        {COURSES.map((c, i) => {
          const coach = window.DATA.coachById(c.coach);
          const hue = [220, 200, 30, 160, 280, 340][i % 6];
          const myReg = registered.find(r => r.courseId === c.id);
          return (
            <article key={c.id} className="mag-card" onClick={() => onPickCourse(c)}>
              <MagPhoto tag={c.tag} num={String(i+1).padStart(2, '0')} hue={hue} />
              <div className="mc-body">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    color: 'var(--brand-700)', textTransform: 'uppercase',
                  }}>每週{c.dowLabel} · {c.time}</span>
                  {myReg && <span className="badge badge-confirmed" style={{fontSize: 10}}>已報名</span>}
                </div>
                <h3>{c.name}</h3>
                <p className="text-soft mt-2" style={{fontSize: 13, lineHeight: 1.55}}>{c.desc}</p>
                <div className="mc-meta">
                  <span>{coach.name.split(' ')[0]}</span>
                  <span>{c.duration} 分</span>
                  <span>👥 {c.min}–{c.max}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Editorial pull-quote */}
      <div style={{
        marginTop: 60, padding: '40px 0',
        borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        textAlign: 'center',
      }}>
        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 14}}>
          訓練哲學
        </div>
        <blockquote style={{fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', maxWidth: 720, margin: '0 auto', lineHeight: 1.3, textWrap: 'pretty'}}>
          「每一次的進步，都來自於設計過的反覆。我們不追求短期的力量爆發，而是建立可持續的訓練習慣。」
        </blockquote>
        <div className="text-sm text-soft" style={{marginTop: 14}}>— CHIN-UP Performance, 2026</div>
      </div>
    </main>
  );
}

function PlanC_CourseModal({ course, onClose, registered, onRegister, onCancel }) {
  if (!course) return null;
  const coach = window.DATA.coachById(course.coach);
  const myReg = registered.find(r => r.courseId === course.id);
  const i = window.DATA.COURSES.findIndex(x => x.id === course.id);
  const hue = [220, 200, 30, 160, 280, 340][i % 6];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}
           style={{maxWidth: 720, padding: 0, overflow: 'hidden'}}>
        <div style={{position: 'relative'}}>
          <MagPhoto tag={course.tag} num={String(i+1).padStart(2, '0')} hue={hue} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none',
            cursor: 'pointer', fontSize: 16,
          }}>✕</button>
        </div>
        <div style={{padding: 32}}>
          <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--brand-700)', textTransform: 'uppercase'}}>
            每週{course.dowLabel} · {course.time}–{(() => {
              const [h, m] = course.time.split(':').map(Number);
              const totalMin = h * 60 + m + course.duration;
              return `${String(Math.floor(totalMin/60)).padStart(2,'0')}:${String(totalMin%60).padStart(2,'0')}`;
            })()}
          </div>
          <h2 style={{fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8, lineHeight: 1.1}}>{course.name}</h2>
          <p className="text-soft mt-3" style={{fontSize: 15, lineHeight: 1.6}}>{course.desc}</p>

          {/* Coach */}
          <div className="flex items-center gap-3" style={{padding: '18px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginTop: 24}}>
            <div className="coach-avatar" style={{width: 46, height: 46, fontSize: 16}}>{coach.name.charAt(0)}</div>
            <div className="flex-1">
              <div style={{fontWeight: 700}}>{coach.name.split(' ')[0]}</div>
              <div className="text-xs text-soft">{coach.tagline}</div>
            </div>
            <button className="btn btn-ghost btn-sm">查看教練</button>
          </div>

          {myReg ? (
            <div style={{marginTop: 20}}>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div style={{fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)'}}>
                  你的進度
                </div>
                <span className="text-tabular text-sm font-bold">已上 {myReg.attended} / {myReg.total} 堂</span>
              </div>
              <div className="prog-bar">
                <div className="pb-attended" style={{width: `${(myReg.attended/myReg.total)*100}%`}}></div>
                <div className="pb-leave" style={{width: `${(myReg.leave/myReg.total)*100}%`}}></div>
                <div className="pb-upcoming" style={{width: `${(myReg.upcoming/myReg.total)*100}%`}}></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn btn-ghost flex-1">轉讓給朋友</button>
                <button className="btn btn-danger flex-1" onClick={() => onCancel(course.id)}>取消整期</button>
              </div>
            </div>
          ) : (
            <div style={{marginTop: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center'}}>
              <div>
                <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)'}}>
                  整期 · 8 堂 · NT$
                </div>
                <div style={{fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 2}}>
                  8,800
                </div>
                <div className="text-xs text-mute">每堂 NT$ 1,100</div>
              </div>
              <button className="btn btn-primary" style={{padding: '14px 28px', fontSize: 15}} onClick={() => onRegister(course.id)}>
                報名整期 →
              </button>
            </div>
          )}

          <div style={{marginTop: 20, padding: 14, background: '#f8faf9', borderRadius: 10, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6}}>
            ※ 請假後該堂無法補課，但可轉讓給朋友（在開課前 24 小時操作）。整期費用一次繳交，期中無法退費。
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanC_Coaches({ onPickCoach }) {
  const { COACHES } = window.DATA;
  const hues = [220, 200, 30, 160];
  return (
    <main className="max-w-6xl mx-auto px-6" style={{paddingTop: 32, paddingBottom: 80}}>
      <div style={{marginBottom: 36}}>
        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)'}}>
          Personal Training
        </div>
        <h1 style={{fontSize: 48, fontWeight: 800, marginTop: 8, letterSpacing: '-0.04em'}}>找教練</h1>
        <p className="text-soft" style={{maxWidth: 580, marginTop: 10, fontSize: 16}}>
          四位專業教練，每位有自己的訓練哲學與專長領域。點擊查看教練的可預約時段。
        </p>
      </div>
      <div className="grid gap-6" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'}}>
        {COACHES.map((c, i) => (
          <article key={c.id} className="mag-card" style={{padding: 0}} onClick={() => onPickCoach(c.id)}>
            <div className="mag-photo" style={{
              aspectRatio: '4 / 5',
              background: `linear-gradient(135deg, hsl(${hues[i]}, 30%, 16%), hsl(${(hues[i]+40)%360}, 25%, 28%))`,
            }}>
              <div className="mp-grid"></div>
              <div className="mp-num" style={{fontSize: 130}}>{String(i+1).padStart(2,'0')}</div>
              <span className="mp-tag">教練 #{i+1}</span>
            </div>
            <div className="mc-body">
              <h3>{c.name.split(' ')[0]}</h3>
              <div className="text-sm" style={{color: 'var(--brand-700)', marginTop: 4, fontWeight: 600}}>{c.tagline}</div>
              <div className="mc-meta" style={{marginTop: 14, paddingTop: 14}}>
                <span>NT$ {c.rate} / 堂</span>
                <span>{(window.DATA.SLOTS[c.id] || []).reduce((n, d) => n + d.times.length, 0)} 個時段</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function PlanC_CoachDetail({ coachId, onBack, onBook }) {
  const c = window.DATA.coachById(coachId);
  const slots = window.DATA.SLOTS[coachId] || [];
  const [pickedDate, setPickedDate] = useStateC(slots[0]?.date);
  const [pickedTime, setPickedTime] = useStateC(null);
  const i = window.DATA.COACHES.findIndex(x => x.id === coachId);
  const hue = [220, 200, 30, 160][i];
  const dayObj = slots.find(s => s.date === pickedDate);

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, hsl(${hue}, 30%, 14%), hsl(${(hue+40)%360}, 25%, 24%))`,
        color: 'white',
        padding: '48px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 24px)`,
        }}></div>
        <div className="max-w-6xl mx-auto px-6" style={{position: 'relative'}}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.1)', color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '6px 14px', borderRadius: 9999,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            marginBottom: 28,
          }}>← 返回</button>
          <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'end'}}>
            <div>
              <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65}}>
                Coach #{String(i+1).padStart(2,'0')} · {c.tagline}
              </div>
              <h1 style={{fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', marginTop: 12, lineHeight: 0.95}}>
                {c.name.split(' ')[0]}
              </h1>
              <div style={{fontSize: 14, opacity: 0.7, marginTop: 6, letterSpacing: '0.04em'}}>{c.name.split(' ').slice(1).join(' ')}</div>
              <p style={{maxWidth: 480, marginTop: 16, fontSize: 15, opacity: 0.85, lineHeight: 1.6}}>{c.bio}</p>
            </div>
            <div style={{
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.15)',
              minWidth: 180,
            }}>
              <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase'}}>單堂費用</div>
              <div style={{fontSize: 28, fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em'}}>NT$ {c.rate}</div>
              <div style={{fontSize: 12, opacity: 0.6, marginTop: 2}}>每堂 60 分鐘</div>
              <div style={{height: 1, background: 'rgba(255,255,255,0.1)', margin: '12px 0'}}></div>
              <div className="flex flex-wrap gap-1.5">
                {c.tags.slice(0, 2).map(t => (
                  <span key={t} style={{fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 9999, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)'}}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking calendar */}
      <section className="max-w-6xl mx-auto px-6" style={{paddingTop: 48, paddingBottom: 80}}>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)'}}>
              Schedule
            </div>
            <h2 style={{fontSize: 32, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em'}}>選擇預約時段</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-soft">
            <svg width="16" height="16" viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="22" rx="2" fill="#fff" stroke="#dadce0" strokeWidth="1.5"/><rect x="3" y="6" width="26" height="6" fill="#4285f4"/></svg>
            同步自 Google Calendar
          </div>
        </div>

        {/* Date row */}
        <div className="grid gap-3" style={{gridTemplateColumns: `repeat(${slots.length}, 1fr)`, marginBottom: 24}}>
          {slots.map(s => (
            <button key={s.date}
                    onClick={() => { setPickedDate(s.date); setPickedTime(null); }}
                    style={{
                      padding: '18px 12px',
                      background: pickedDate === s.date ? 'var(--ink)' : 'var(--surface)',
                      color: pickedDate === s.date ? 'white' : 'var(--ink)',
                      border: `1px solid ${pickedDate === s.date ? 'var(--ink)' : 'var(--line)'}`,
                      borderRadius: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 160ms ease',
                    }}>
              <div className="text-tabular" style={{fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1}}>{s.date}</div>
              <div style={{fontSize: 12, marginTop: 6, opacity: pickedDate === s.date ? 0.8 : 0.6}}>{s.day} · {s.times.length} 時段</div>
            </button>
          ))}
        </div>

        {dayObj && (
          <div>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 12}}>
              {dayObj.date} {dayObj.day}・可預約時段
            </div>
            <div className="grid gap-2" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))'}}>
              {[...Array(14)].map((_, i) => {
                const h = 8 + i;
                const time = `${String(h).padStart(2,'0')}:00`;
                const available = dayObj.times.includes(time);
                return (
                  <button key={time}
                          disabled={!available}
                          className={`slot-btn ${pickedTime === time ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                          style={{padding: '14px 8px', fontSize: 14}}
                          onClick={() => setPickedTime(time)}>
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {pickedTime && (
          <div style={{
            marginTop: 32,
            padding: '24px 28px',
            background: 'var(--ink)', color: 'white',
            borderRadius: 16,
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center',
          }}>
            <div>
              <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase'}}>
                即將預約
              </div>
              <div style={{fontSize: 26, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em'}}>
                <span className="text-tabular">{pickedDate}</span> {dayObj.day} {pickedTime}
              </div>
              <div style={{opacity: 0.7, fontSize: 14, marginTop: 4}}>
                {c.name.split(' ')[0]} · 60 分鐘 · NT$ {c.rate}
              </div>
            </div>
            <button className="btn btn-primary" style={{padding: '14px 22px'}}
                    onClick={() => onBook({ coachId, date: pickedDate, day: dayObj.day, time: pickedTime })}>
              確認預約 →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function PlanC_BookingDone({ booking, onDone }) {
  const c = window.DATA.coachById(booking.coachId);
  return (
    <main className="max-w-6xl mx-auto px-6" style={{paddingTop: 80, paddingBottom: 80}}>
      <div style={{maxWidth: 640, margin: '0 auto', textAlign: 'center'}}>
        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand-700)', marginBottom: 14}}>
          Confirmed · 預約成功
        </div>
        <h1 style={{fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05}}>
          見啦，<br/>我們<span style={{color: 'var(--brand-600)'}}>{booking.date}</span> 見。
        </h1>
        <p className="text-soft" style={{marginTop: 18, fontSize: 16}}>
          邀請函已寄送至你的 Email。記得開課前 24 小時可免費取消。
        </p>

        <div className="card" style={{marginTop: 36, padding: 28, textAlign: 'left'}}>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 pb-4" style={{borderBottom: '1px solid var(--line)'}}>
              <div className="coach-avatar" style={{width: 48, height: 48, fontSize: 18}}>{c.name.charAt(0)}</div>
              <div>
                <div style={{fontWeight: 700}}>{c.name.split(' ')[0]}</div>
                <div className="text-xs text-mute">{c.tagline}</div>
              </div>
            </div>
            <div className="grid gap-3" style={{gridTemplateColumns: '1fr 1fr'}}>
              <div>
                <div className="text-xs text-mute" style={{fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'}}>日期</div>
                <div className="text-tabular font-bold" style={{fontSize: 20, marginTop: 4, letterSpacing: '-0.02em'}}>{booking.date} {booking.day}</div>
              </div>
              <div>
                <div className="text-xs text-mute" style={{fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'}}>時間</div>
                <div className="text-tabular font-bold" style={{fontSize: 20, marginTop: 4, letterSpacing: '-0.02em'}}>{booking.time} (60 分)</div>
              </div>
              <div>
                <div className="text-xs text-mute" style={{fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'}}>地點</div>
                <div className="font-bold" style={{fontSize: 16, marginTop: 4}}>CHINUP Studio</div>
              </div>
              <div>
                <div className="text-xs text-mute" style={{fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'}}>費用</div>
                <div className="font-bold" style={{fontSize: 16, marginTop: 4}}>NT$ {c.rate}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <button className="btn btn-ghost">分享給朋友</button>
          <button className="btn btn-primary" onClick={onDone}>完成・回首頁</button>
        </div>
      </div>
    </main>
  );
}

function PlanC() {
  const [page, setPage] = useStateC('home');
  const [openCourse, setOpenCourse] = useStateC(null);
  const [registered, setRegistered] = useStateC(window.DATA.MY_REGS);
  const [pickedCoach, setPickedCoach] = useStateC(null);
  const [booking, setBooking] = useStateC(null);

  const handleNav = (id) => {
    if (id === 'home') setPage('home');
    if (id === 'oneonone') { setPage('coaches'); setPickedCoach(null); setBooking(null); }
    if (id === 'mine') setPage('home');
  };

  return (
    <div className="mobile-screen" style={{minHeight: 900, background: 'var(--canvas)'}}>
      <PlanC_Nav active={page === 'coaches' ? 'oneonone' : 'home'} onNav={handleNav} />
      {page === 'home' && (
        <PlanC_Home onPickCourse={setOpenCourse} registered={registered} />
      )}
      {page === 'coaches' && !pickedCoach && (
        <PlanC_Coaches onPickCoach={setPickedCoach} />
      )}
      {page === 'coaches' && pickedCoach && !booking && (
        <PlanC_CoachDetail coachId={pickedCoach}
                           onBack={() => setPickedCoach(null)}
                           onBook={setBooking} />
      )}
      {page === 'coaches' && booking && (
        <PlanC_BookingDone booking={booking} onDone={() => { setBooking(null); setPickedCoach(null); }} />
      )}
      <PlanC_CourseModal
        course={openCourse}
        registered={registered}
        onClose={() => setOpenCourse(null)}
        onRegister={(cid) => {
          setRegistered(prev => [...prev, {
            id: Date.now(), courseId: cid, period: 'p3',
            total: 8, attended: 0, upcoming: 8, leave: 0, transferable: 0,
          }]);
          setOpenCourse(null);
        }}
        onCancel={(cid) => {
          setRegistered(prev => prev.filter(r => r.courseId !== cid));
          setOpenCourse(null);
        }}
      />
    </div>
  );
}

window.PlanC = PlanC;
