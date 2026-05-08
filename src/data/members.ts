import type { Member } from '../types';

export const MEMBERS: Member[] = [
  { id: 'jihwan',  name: '지환',  emoji: '🤩', confirmed: true /* 텐션 좋음 */ },
  { id: 'jibin',   name: '지빈',  emoji: '🎤', confirmed: true /* 분위기메이커 */ },
  { id: 'jiyeon',  name: '지연',  emoji: '😆', confirmed: true /* 잘 웃음 */ },
  { id: 'boyeon',  name: '보연',  emoji: '🌿', confirmed: true /* 무던히 잘 어울림 */ },
  { id: 'byungdo', name: '병도',  emoji: '☕', confirmed: true, isDriver: true, carId: 'car1' /* 차분한 어른, 셀토스 SUV */ },
  { id: 'hyewon',  name: '혜원',  emoji: '🤪', confirmed: true /* 말괄량이 */ },
  { id: 'miseo',   name: '미서',  emoji: '🛠',  confirmed: true /* ISTP 스타일 */ },
  { id: 'jongmin', name: '종민',  confirmed: false /* 미확정 */ },
];
// 두 번째 운전자(차량2)는 사이트의 차량 배치 페이지에서 관리자 모드로 설정
