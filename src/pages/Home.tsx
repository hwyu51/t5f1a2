import Card from '../components/Card';
import DDayBanner from '../components/DDayBanner';
import MemberCard from '../components/MemberCard';
import MiniSchedule from '../components/MiniSchedule';
import Section from '../components/Section';
import { MEMBERS } from '../data/members';
import { PLACES } from '../data/places';
import { TRIP } from '../data/trip';
import { useCurrentUser } from '../hooks/useCurrentUser';

const TARGET_ISO = `${TRIP.startDate}T${TRIP.departureTime}:00+09:00`;

const ALERTS = [
  { icon: '⚾', title: '야구 유니폼', desc: '바닷가 노상 드레스코드 (혜원·지환이 보유, 빌리세요)' },
  { icon: '👕', title: '버릴 옷 + 내복', desc: '머드축제용. 위아래 + 갈아입을 비닐' },
  { icon: '🩴', title: '크록스 or 슬리퍼', desc: '운동화 X. 머드축제장에서 신을 신발' },
];

export default function Home() {
  const { user, clear } = useCurrentUser();
  const meetingPlace = PLACES.find((p) => p.id === TRIP.meetingPlaceId);

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
              <div className="text-xs text-ink-muted">본인</div>
              <div className="mt-0.5 text-lg font-bold text-ink">
                {user.name}{' '}
                {user.isDriver && (
                  <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                    🚗 운전
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg px-3 py-1.5 text-xs text-ink-muted hover:bg-cream-100"
            >
              변경
            </button>
          </Card>
        </Section>
      )}

      {/* 집합 정보 */}
      <Section title="🚩 집합 정보">
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

      {/* 일정 미리보기 */}
      <Section title="📅 일정 미리보기">
        <MiniSchedule />
      </Section>

      {/* 멤버 목록 */}
      <Section title={`👥 멤버 (${MEMBERS.filter((m) => m.confirmed).length}/${MEMBERS.length})`}>
        <div className="grid grid-cols-4 gap-2">
          {MEMBERS.map((m) => (
            <MemberCard key={m.id} member={m} isSelf={m.id === user?.id} />
          ))}
        </div>
      </Section>

      {/* 챙길 것 알림 */}
      <Section title="⚠️ 꼭 챙겨오세요">
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
