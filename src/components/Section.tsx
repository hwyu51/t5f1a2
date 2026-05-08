import type { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Section({ title, children, className = '' }: Props) {
  return (
    <section className={`px-4 ${className}`}>
      {title && <h2 className="mb-2 text-base font-bold text-ink">{title}</h2>}
      {children}
    </section>
  );
}
