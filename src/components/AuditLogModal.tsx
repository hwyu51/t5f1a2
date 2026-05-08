import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import type { AuditEntry } from '../utils/audit';

type Props = {
  open: boolean;
  onClose: () => void;
};

const ENTRIES_LIMIT = 100;

export default function AuditLogModal({ open, onClose }: Props) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    if (!open) return;
    const q = query(
      collection(db, 'auditLog'),
      orderBy('createdAt', 'desc'),
      limit(ENTRIES_LIMIT),
    );
    return onSnapshot(q, (snap) => {
      setEntries(snap.docs.map((d) => d.data() as AuditEntry));
    });
  }, [open]);

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
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[28rem] flex-col rounded-t-3xl bg-card shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-line p-4">
          <h2 className="text-base font-bold text-ink">🔧 변경 이력</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-ink-muted hover:bg-cream-100"
          >
            닫기
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
          {entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">
              아직 변경 이력 없음
            </p>
          ) : (
            <ul className="space-y-2">
              {entries.map((e, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-line bg-cream-50/60 p-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-bold text-ink">{e.action}</span>
                    <span className="shrink-0 text-[11px] text-ink-muted">
                      {formatTime(e.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    <span className="font-bold text-ink">{e.actorName}</span> · {e.target}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  if (sameDay) return `${hh}:${mm}`;
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}
