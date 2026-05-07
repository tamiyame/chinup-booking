import { useNavigate } from 'react-router-dom';

export default function CoachCard({ coach }) {
  const navigate = useNavigate();
  return (
    <article className="coach-card" onClick={() => navigate(`/coaches/${coach.id}`)}>
      <div className="flex items-start gap-3">
        <CoachAvatar coach={coach} size={64} />
        <div style={{ flex: 1 }}>
          <div className="cc-name">{firstPart(coach.name)}</div>
          <div className="cc-name-en">{restParts(coach.name)}</div>
          <div className="cc-tag mt-1">{coach.tagline}</div>
        </div>
      </div>
      <div className="cc-bio">{coach.bio}</div>
      <div className="flex flex-wrap gap-1">
        {(coach.tags ?? []).map(t => <span key={t} className="tag-chip">{t}</span>)}
      </div>
      <div className="flex items-center justify-between" style={{ paddingTop: 14, borderTop: '1px solid var(--line)' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>證照</div>
          <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2 }}>{(coach.certifications ?? []).join(' · ')}</div>
        </div>
        <button className="btn btn-primary btn-sm">查看時段</button>
      </div>
    </article>
  );
}

export function CoachAvatar({ coach, size = 64 }) {
  const initial = coach?.name?.charAt(0) ?? '?';
  return (
    <div className="coach-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {coach?.photo_url
        ? <img src={coach.photo_url} alt={coach.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        : initial}
    </div>
  );
}

function firstPart(name = '') { return name.split(' ')[0]; }
function restParts(name = '') { return name.split(' ').slice(1).join(' '); }
