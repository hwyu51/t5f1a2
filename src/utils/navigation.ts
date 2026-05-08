export type NavTarget = {
  name: string;
  lat: number;
  lng: number;
  address?: string;
};

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return true;
  // iPadOS 13+ 는 UA를 Macintosh로 위장 — maxTouchPoints로 감지
  if (
    ua.includes('Macintosh') &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1
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
        return `https://map.kakao.com/?q=${query}`;
      case 'naver':
        return `https://map.naver.com/v5/search/${query}`;
      case 'tmap':
        // 티맵 모바일은 검색 스킴, 데스크탑은 티맵 웹 부재라 카카오로
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
      return mobile
        ? `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encName}`
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
