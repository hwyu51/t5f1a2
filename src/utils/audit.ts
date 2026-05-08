import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type AuditEntry = {
  actorId: string;
  actorName: string;
  action: string; // '메뉴 추가', '지출 삭제' 등
  target: string; // 대상 이름/메모
  createdAt: number;
};

/**
 * 사용자 변경 이력 기록. 실패해도 본 작업엔 영향 X (catch).
 * 관리자 모드에서 누가 언제 뭐 했는지 조회.
 */
export async function logAudit(
  entry: Omit<AuditEntry, 'createdAt'>,
): Promise<void> {
  try {
    await addDoc(collection(db, 'auditLog'), {
      ...entry,
      createdAt: Date.now(),
    });
  } catch (e) {
    console.warn('audit log 기록 실패', e);
  }
}
