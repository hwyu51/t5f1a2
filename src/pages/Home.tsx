import Card from '../components/Card';
import DDayBanner from '../components/DDayBanner';
import MemberCard from '../components/MemberCard';
import MiniSchedule from '../components/MiniSchedule';
import Section from '../components/Section';
import { PLACES } from '../data/places';
import { TRIP } from '../data/trip';
import { useAdminMode } from '../hooks/useAdminMode';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useMembers } from '../hooks/useMembers';
import { logAudit } from '../utils/audit';

const TARGET_ISO = `${TRIP.startDate}T${TRIP.departureTime}:00+09:00`;

const ALERTS = [
  { icon: '⚾', title: '야구 유니폼', desc: '노상 드레스코드 — 혜원·지환이 갖고 있으니 빌려달라 해' },
  { icon: '👕', title: '버릴 옷 한 벌', desc: '머드축제 들어갈 옷. 끝나면 비닐에 담아 버려' },
  { icon: '🩴', title: '크록스/슬리퍼', desc: '운동화 X. 머드 묻을 거 신어' },
];

export default function Home() {
  const { user, clear } = useCurrentUser();
  const { members, setConfirmed } = useMembers();
  const { isAdmin } = useAdminMode();
  const meetingPlace = PLACES.find((p) => p.id === TRIP.meetingPlaceId);
  const jongmin = members.find((m) => m.id === 'jongmin');

  return (
    <div className="space-y-5 pb-4">
      {/* 헤더 */}
      <div className="px-4 pt-5">
        <DDayBanner targetIso={TARGET_ISO} />
      </div>

      {/* 본인 정보 */}
      {user && (
        <Section>
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-xs text-ink-muted">나</div>
              <div className="mt-0.5 text-lg font-bold text-ink">{user.name}</div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg px-3 py-1.5 text-xs text-ink-muted hover:bg-cream-100"
            >
              바꾸기
            </button>
          </Card>
        </Section>
      )}

      {/* 집합 정보 */}
      <Section title="🚩 어디서 만나">
        <Card className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="text-base font-bold text-ink">{meetingPlace?.name}</div>
            <div className="text-2xl font-black tabular-nums text-orange-600">
              {TRIP.departureTime}
            </div>
          </div>
          {meetingPlace?.address && (
            <div className="text-sm text-ink-muted">{meetingPlace.address}</div>
          )}
          {meetingPlace?.note && (
            <div className="text-xs text-ink-muted">{meetingPlace.note}</div>
          )}
        </Card>
      </Section>

      {/* 일정 미리 */}
      <Section title="📅 일정 미리">
        <MiniSchedule />
      </Section>

      {/* 갈 사람 */}
      <Section title={`🙌 갈 사람 (${members.filter((m) => m.confirmed).length}/${members.length})`}>
        <div className="grid grid-cols-4 gap-2">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} isSelf={m.id === user?.id} />
          ))}
        </div>
      </Section>

      {/* 관리자 — 종민 합류 토글 */}
      {isAdmin && jongmin && (
        <Section title="🔧 관리자">
          <Card className="!p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">
                {jongmin.emoji ?? '❓'} 종민 합류 ·{' '}
                <span className={jongmin.confirmed ? 'font-bold text-green-700' : 'font-bold text-ink-muted'}>
                  {jongmin.confirmed ? '확정' : '미정'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = !jongmin.confirmed;
                  setConfirmed('jongmin', next);
                  if (user) {
                    void logAudit({
                      actorId: user.id,
                      actorName: user.name,
                      action: '종민 합류',
                      target: next ? '확정' : '미정',
                    });
                  }
                }}
                className="rounded-lg border border-orange-500 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700"
              >
                {jongmin.confirmed ? '미정으로' : '확정으로'}
              </button>
            </div>
          </Card>
        </Section>
      )}

      {/* 챙길 것 알림 */}
      <Section title="⚠️ 까먹지 마">
        <Card className="space-y-3 border-warn-border bg-warn-bg">
          {ALERTS.map((a) => (
            <div key={a.title} className="flex gap-3">
              <div className="text-2xl leading-tight">{a.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-warn-ink">{a.title}</div>
                <div className="mt-0.5 text-xs text-warn-ink/80">{a.desc}</div>
              </div>
            </div>
          ))}
        </Card>
      </Section>
    </div>
  );
}
