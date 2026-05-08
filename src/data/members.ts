import type { Member } from '../types';

export const MEMBERS: Member[] = [
  { id: 'jihwan', name: '지환', confirmed: true },
  { id: 'jibin', name: '지빈', confirmed: true },
  { id: 'jiyeon', name: '지연', confirmed: true },
  { id: 'boyeon', name: '보연', confirmed: true },
  { id: 'byungdo', name: '병도', confirmed: true, isDriver: true, carId: 'car1' /* 셀토스 SUV */ },
  { id: 'hyewon', name: '혜원', confirmed: true },
  { id: 'miseo', name: '미서', confirmed: true },
  { id: 'jongmin', name: '종민', confirmed: false /* 미확정, 그대로 둠 */ },
];
// 두 번째 운전자(차량2)는 사이트의 차량 배치 페이지에서 관리자 모드로 설정
