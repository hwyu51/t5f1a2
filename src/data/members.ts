import type { Member } from '../types';

export const MEMBERS: Member[] = [
  { id: 'jihwan',  name: '지환',  emoji: '🌟', mbti: 'ENFP', confirmed: true, isDriver: true /* 텐션 좋음, 운전 */ },
  { id: 'jibin',   name: '지빈',  emoji: '🪩', mbti: 'ESFP', confirmed: true, isDriver: true /* 분위기메이커, 운전 */ },
  { id: 'jiyeon',  name: '지연',  emoji: '🌙', mbti: 'INTJ', confirmed: true /* 잘 웃음 */ },
  { id: 'boyeon',  name: '보연',  emoji: '💡', mbti: 'ENTP', confirmed: true /* 무던히 잘 어울림 */ },
  { id: 'byungdo', name: '병도',  emoji: '🔧', mbti: 'ISTP', confirmed: true /* 차분한 어른 */ },
  { id: 'hyewon',  name: '혜원',  emoji: '👑', mbti: 'ENTJ', confirmed: true /* 말괄량이 */ },
  { id: 'miseo',   name: '미서',  emoji: '📋', mbti: 'ISTJ', confirmed: true /* ISTP 스타일이라 했는데 ISTJ로 정정 */ },
  // 종민: 최종 불참 확정 (2026-07-20) — 명단에서 제외. 참여 7명.
];
// 차량 1대 렌트 (8인승급). 운전 가능: 지환·지빈.
