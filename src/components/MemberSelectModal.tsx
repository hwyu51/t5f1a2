import { useEffect } from 'react';
import { useMembers } from '../hooks/useMembers';
import type { Member } from '../types';

type Props = {
  open: boolean;
  onSelect: (member: Member) => void;
  onClose?: () => void;
  closable?: boolean;
};

export default function MemberSelectModal({ open, onSelect, onClose, closable = false }: Props) {
  const { members } = useMembers();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={() => closable && onClose?.()}
    >
      <div
        className="w-full max-w-[28rem] rounded-t-3xl bg-card p-5 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4 text-center">
          <h2 className="text-lg font-bold text-ink">본인 선택</h2>
          <p className="mt-1 text-sm text-ink-muted">
            한 번만 선택해 주세요. 나중에 변경 가능해요.
          </p>
        </header>

        <ul className="grid grid-cols-3 gap-2.5">
          {members.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelect(m)}
                className={`flex min-h-[88px] w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 transition active:scale-95 ${
                  m.confirmed
                    ? 'border-line bg-cream-50 hover:border-orange-500 hover:bg-orange-50'
                    : 'border-dashed border-line bg-cream-50/50 text-ink-muted hover:border-orange-500'
                }`}
              >
                <span className="text-2xl leading-none">
                  {m.confirmed ? (m.emoji ?? '🙂') : '❓'}
                </span>
                <span className="text-sm font-bold text-ink">{m.name}</span>
                {!m.confirmed && (
                  <span className="text-[10px] text-ink-muted">미정</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl py-2.5 text-sm text-ink-muted hover:bg-cream-100"
          >
            닫기
          </button>
        )}
      </div>
    </div>
  );
}
