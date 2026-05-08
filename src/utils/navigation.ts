export type NavTarget = {
  name: string;
  lat: number;
  lng: number;
  address?: string;
};

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export type NavApp = 'kakao' | 'tmap' | 'naver';

function hasCoords(t: NavTarget): boolean {
  return Boolean(t.lat) && Boolean(t.lng);
}

export function buildNavUrl(app: NavApp, target: NavTarget): string {
  const { name, lat, lng, address } = target;
  const encName = encodeURIComponent(name);
  const mobile = isMobile();

  // 좌표 없으면 주소(또는 이름)로 검색 fallback (모바일/데스크탑 모두 웹)
  if (!hasCoords(target)) {
    const query = encodeURIComponent(address || name);
    if (app === 'naver') return `https://map.naver.com/v5/search/${query}`;
    // 카카오/티맵 모두 카카오맵 검색으로
    return `https://map.kakao.com/?q=${query}`;
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

export function openNav(app: NavApp, target: NavTarget): void {
  const url = buildNavUrl(app, target);
  if (isMobile() && hasCoords(target)) {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
