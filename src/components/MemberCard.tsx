import type { Member } from '../types';

type Props = {
  member: Member;
  isSelf?: boolean;
};

export default function MemberCard({ member, isSelf = false }: Props) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2 ${
        isSelf
          ? 'border-orange-500 bg-orange-50'
          : member.confirmed
            ? 'border-line bg-card'
            : 'border-dashed border-line bg-cream-50/60'
      }`}
    >
      <div className="text-2xl leading-none">
        {member.confirmed ? (member.emoji ?? '🙂') : '❓'}
      </div>
      <div className="text-sm font-bold text-ink">{member.name}</div>
      {!member.confirmed ? (
        <div className="text-[10px] font-bold text-ink-muted">미정</div>
      ) : member.isDriver ? (
        <div className="text-[10px] font-bold text-ink-muted">운전</div>
      ) : null}
    </div>
  );
}
