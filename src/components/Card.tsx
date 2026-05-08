import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: Props) {
  return (
    <div
      className={`rounded-2xl border border-line bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}
    >
      {children}
    </div>
  );
}
