export type NavTarget = {
  name: string;
  lat: number;
  lng: number;
  address?: string;
};

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // 모바일 일반 (Mobi 추가 — Firefox Mobile, 일부 안드로이드)
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return true;
  // iPadOS 13+ Macintosh 위장
  if (
    ua.includes('Macintosh') &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }
  // 마지막 fallback: 터치 가능 + 좁은 화면
  if (
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 0 &&
    typeof window !== 'undefined' &&
    window.innerWidth <= 768
  ) {
    return true;
  }
  return false;
}

export type NavApp = 'kakao' | 'tmap' | 'naver';

function hasCoords(t: NavTarget): boolean {
  return Boolean(t.lat) && Boolean(t.lng);
}

export function buildNavUrl(app: NavApp, target: NavTarget): string {
  const { name, lat, lng, address } = target;
  const encName = encodeURIComponent(name);
  const mobile = isMobile();

  // 좌표 없으면 검색 fallback
  if (!hasCoords(target)) {
    const query = encodeURIComponent(address || name);
    switch (app) {
      case 'kakao':
        return mobile
          ? `kakaomap://search?q=${query}`
          : `https://map.kakao.com/?q=${query}`;
      case 'naver':
        return mobile
          ? `nmap://search?query=${query}&appname=t5f1a2`
          : `https://map.naver.com/v5/search/${query}`;
      case 'tmap':
        return mobile
          ? `tmap://search?name=${query}`
          : `https://map.kakao.com/?q=${query}`;
    }
  }

  switch (app) {
    case 'kakao':
      return mobile
        ? `kakaomap://route?ep=${lat},${lng}&by=CAR`
        : `https://map.kakao.com/link/to/${encName},${lat},${lng}`;
    case 'tmap':
      return mobile
        ? `tmap://route?goalname=${encName}&goalx=${lng}&goaly=${lat}`
        : `https://map.kakao.com/link/to/${encName},${lat},${lng}`;
    case 'naver':
      // 네이버맵은 appname 파라미터 필수 — 없으면 앱이 안 열림
      return mobile
        ? `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encName}&appname=t5f1a2`
        : `https://map.naver.com/v5/directions/-/${lng},${lat},${encName}/-/car`;
  }
}

const APP_SCHEMES = ['tmap://', 'kakaomap://', 'nmap://'];

export function openNav(app: NavApp, target: NavTarget): void {
  const url = buildNavUrl(app, target);
  const isAppScheme = APP_SCHEMES.some((s) => url.startsWith(s));
  if (isAppScheme) {
    // 앱 스킴은 location.href로 시도 (미설치 시 무반응)
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
