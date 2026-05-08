import { MEMBERS } from '../data/members';
import type { Member } from '../types';
import { useFirestoreDoc } from './useFirestoreDoc';

const PATH = 'state/memberOverrides';

type Override = Partial<Pick<Member, 'confirmed'>>;
type State = { overrides: Record<string, Override> };

const DEFAULT: State = { overrides: {} };

/**
 * 시드 MEMBERS + Firestore 오버라이드 합쳐서 반환.
 * 관리자가 사이트에서 종민 합류 토글한 결과 등이 반영됨.
 */
export function useMembers() {
  const { value, update } = useFirestoreDoc<State>(PATH, DEFAULT);

  const members: Member[] = MEMBERS.map((m) => {
    const ov = value.overrides?.[m.id];
    return ov ? { ...m, ...ov } : m;
  });

  const setConfirmed = (memberId: string, confirmed: boolean) => {
    void update((prev) => ({
      overrides: {
        ...(prev.overrides ?? {}),
        [memberId]: { ...(prev.overrides?.[memberId] ?? {}), confirmed },
      },
    }));
  };

  return { members, setConfirmed };
}
