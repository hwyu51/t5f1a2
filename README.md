# T5F1A2 — 대천 1박2일

T5F1A2 모임의 2026.07.25–26 대천 머드축제 여행 사이트. 모바일 우선 PWA, GitHub Pages 배포.

배포: https://hwyu51.github.io/t5f1a2/

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 GitHub Pages에 배포합니다.

## 기술 스택

- Vite 5 + React 18 + TypeScript (strict)
- Tailwind CSS v4
- React Router v6
- (Phase 5+) Firebase Firestore + Storage

## 진행 단계

| Phase | 내용                                     | 상태 |
| ----- | ---------------------------------------- | ---- |
| 1     | 기반 + 홈 + 멤버 모달 + 배포             | ✅   |
| 2     | 정보 페이지 (일정/경로/숙소/비상)        | ⏳   |
| 3     | 메뉴 라이브러리 + 슬롯 + 장보기          | ⏳   |
| 4     | 인터랙티브 (준비물/차량/정산) + 관리자모드 | ⏳   |
| 5     | Firebase 연동 + 영수증 + 메뉴 댓글       | ⏳   |
| 6     | PWA + OG + 출시 점검                     | ⏳   |

자세한 내용은 [trip-planner-spec.md](./trip-planner-spec.md) 참조.
