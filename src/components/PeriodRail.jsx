const STATUS_LABEL = { past: '已結束', current: '進行中', open: '報名中', soon: '尚未開放' };

export default function PeriodRail({ periods, active, onPick }) {
  return (
    <div className="period-rail">
      {periods.map(p => (
        <button
          key={p.id}
          className={`period-pill ${active === p.id ? 'active' : ''}`}
          onClick={() => onPick(p.id)}
        >
          <div className="pp-label">{p.label}</div>
          <div className="pp-months">{p.months}</div>
          <div className="pp-meta">{STATUS_LABEL[p.status]}</div>
        </button>
      ))}
    </div>
  );
}
