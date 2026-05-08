import Card from '../components/Card';
import NavLinks from '../components/NavLinks';
import Section from '../components/Section';
import { LODGING } from '../data/lodging';
import { useMembers } from '../hooks/useMembers';

export default function LodgingPage() {
  const { members } = useMembers();
  const payer = members.find((m) => m.id === LODGING.payerId);
  const phoneHref = `tel:${LODGING.phone.replace(/-/g, '')}`;

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">숙소</h1>
        <p className="mt-1 text-sm text-ink-muted">{LODGING.name}</p>
      </div>

      <Section>
        <Card className="space-y-3">
          <div>
            <div className="text-xs text-ink-muted">주소</div>
            <div className="mt-0.5 text-sm font-medium text-ink">{LODGING.address}</div>
          </div>

          <NavLinks
            target={{
              name: LODGING.name,
              lat: LODGING.lat,
              lng: LODGING.lng,
              address: LODGING.address,
            }}
          />

          <div className="border-t border-line" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-ink-muted">체크인</div>
              <div className="mt-0.5 text-sm font-bold text-ink">{LODGING.checkIn}부터</div>
            </div>
            <div>
              <div className="text-xs text-ink-muted">체크아웃</div>
              <div className="mt-0.5 text-sm font-bold text-ink">{LODGING.checkOut}까지</div>
            </div>
          </div>

          <div className="border-t border-line" />

          <div className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-ink-muted">사업자</span>
              <span className="font-medium text-ink">{LODGING.bizName}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-ink-muted">전화</span>
              <a
                href={phoneHref}
                className="font-bold text-orange-600 underline-offset-2 hover:underline"
              >
                {LODGING.phone}
              </a>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="💵 비용">
        <Card className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ink-muted">숙박비</span>
            <span className="text-base font-bold text-ink">
              {LODGING.cost.toLocaleString()}원
            </span>
          </div>
          {payer && (
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink-muted">결제자</span>
              <span className="font-medium text-ink">
                {payer.name}{' '}
                <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                  {LODGING.paid ? '결제됨' : '미결제'}
                </span>
              </span>
            </div>
          )}
        </Card>
      </Section>

      <Section title="📋 참고 사항">
        <Card>
          <ul className="space-y-2 text-sm text-ink">
            {LODGING.notes.map((note, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-orange-500">•</span>
                <span className="whitespace-pre-line">{note}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  );
}
