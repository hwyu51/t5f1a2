import Card from '../components/Card';
import Section from '../components/Section';
import { EMERGENCY } from '../data/emergency';

export default function EmergencyPage() {
  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">🆘 비상 연락망</h1>
        <p className="mt-1 text-sm text-ink-muted">
          멤버끼리는 카톡 단톡 활용 · 외부 연락처 한 번에 전화 걸기
        </p>
      </div>

      <Section title="📞 외부 연락처">
        <div className="space-y-2">
          {EMERGENCY.external.map((contact) => {
            const phoneHref = `tel:${contact.phone.replace(/-/g, '')}`;
            return (
              <Card key={contact.name} className="!p-3">
                <a href={phoneHref} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-ink">{contact.name}</div>
                    <div className="mt-0.5 font-medium tabular-nums text-orange-600">
                      {contact.phone}
                    </div>
                    {contact.note && (
                      <div className="mt-0.5 text-xs text-ink-muted">{contact.note}</div>
                    )}
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-xl text-white shadow-sm transition active:scale-95">
                    📞
                  </div>
                </a>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="🆘 비상 신고">
        <Card className="space-y-2">
          <EmergencyRow label="범죄 신고" phone="112" />
          <EmergencyRow label="화재/구급" phone="119" />
          <EmergencyRow label="해양 사고" phone="122" />
        </Card>
      </Section>

      <Section>
        <Card className="border-warn-border bg-warn-bg !text-xs text-warn-ink">
          <p className="font-bold">🛟 해수욕장 안전 수칙</p>
          <ul className="mt-1.5 space-y-0.5 pl-4">
            <li className="list-disc">음주 후 입수 절대 금지</li>
            <li className="list-disc">조류·이안류 주의 (대천해수욕장 7~8월 자주 발생)</li>
            <li className="list-disc">스카이바이크 음주자 탑승 불가</li>
            <li className="list-disc">머드 → 눈·입에 들어가면 즉시 물로 헹굼</li>
          </ul>
        </Card>
      </Section>
    </div>
  );
}

function EmergencyRow({ label, phone }: { label: string; phone: string }) {
  return (
    <a
      href={`tel:${phone}`}
      className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-cream-100"
    >
      <span className="text-sm text-ink">{label}</span>
      <span className="text-base font-black tabular-nums text-orange-600">{phone}</span>
    </a>
  );
}
