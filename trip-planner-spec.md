# T5F1A2 대천 여행 사이트 — 프로젝트 스펙 v3

## 0. 프로젝트 명칭

- **모임 이름**: T5F1A2
- **여행명**: 대천 1박2일 (2026.07.25-26)
- **저장소 권장명**: `t5f1a2-trip` 또는 `daecheon-trip`

## 1. 프로젝트 개요

- 친구 그룹 7~8명 (확정 7 + 미확정 1)
- 자차 2대로 이동, 운전자 사전 고정
- 모바일 우선 (여행 중 폰 사용)
- 한국어 UI
- GitHub Pages 배포

## 2. 기술 스택

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router v6
- Firebase Firestore (실시간 공유 데이터)
- Firebase Storage (영수증 사진)
- PWA (`vite-plugin-pwa`)
- GitHub Actions로 자동 빌드 + GitHub Pages 배포

## 3. 데이터 처리 원칙

- **정적** (`src/data/*.ts`): 멤버, 일정, 숙소, 경로, 메뉴 라이브러리, 준비물, 비상 연락망 — Git push로 업데이트
- **공유 실시간** (Firestore): 메뉴 슬롯 선택, 재료 체크, 지출+영수증, 차량 배치, 위치 메모, 도착 체크인
- **개인** (LocalStorage): 본인 멤버 ID, 개인 준비물 체크
- 더미 데이터 안 씀. 처음부터 실데이터로 시작. 모르는 부분만 `// TODO` 마킹

(이하 사용자 답변에 첨부된 스펙 v3 전문은 작업 중 메모리상에서 참조함. 본 파일은 placeholder.)
