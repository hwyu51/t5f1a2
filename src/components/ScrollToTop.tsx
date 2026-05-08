import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 라우트 경로 변경 시 페이지 최상단으로 스크롤.
 * 탭/링크 이동 후 이전 스크롤 위치가 남는 문제 해결.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}
