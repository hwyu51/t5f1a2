import { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => boolean; // true면 성공 → 모달 닫음
};

export default function AdminPasswordModal({ open, onClose, onSubmit }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setPassword('');
    setError(false);
    // 모달 열릴 때 자동 포커스
    setTimeout(() => inputRef.current?.focus(), 50);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    const ok = onSubmit(password);
    if (ok) {
      onClose();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-2xl bg-card p-5 shadow-xl"
      >
        <header className="mb-3 text-center">
          <h2 className="text-base font-bold text-ink">🔧 관리자 비밀번호</h2>
        </header>
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          maxLength={20}
          autoComplete="off"
          className={`w-full rounded-lg border-2 bg-cream-50 px-3 py-2.5 text-center text-lg tabular-nums tracking-widest ${
            error ? 'border-red-400' : 'border-line'
          }`}
        />
        {error && (
          <p className="mt-2 text-center text-xs font-bold text-red-500">
            비밀번호가 일치하지 않아요
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-line bg-cream-50 py-2 text-sm font-bold text-ink-muted"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!password}
            className="flex-1 rounded-xl bg-orange-500 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-40"
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
}
