export type NavTarget = {
  name: string;
  lat: number;
  lng: number;
};

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export type NavApp = 'kakao' | 'tmap' | 'naver';

export function buildNavUrl(app: NavApp, target: NavTarget): string {
  const { name, lat, lng } = target;
  const encName = encodeURIComponent(name);
  const mobile = isMobile();

  switch (app) {
    case 'kakao':
      return mobile
        ? `kakaomap://route?ep=${lat},${lng}&by=CAR`
        : `https://map.kakao.com/link/to/${encName},${lat},${lng}`;
    case 'tmap':
      // 티맵은 모바일 앱만, 데스크톱은 카카오 웹 fallback
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
  if (isMobile()) {
    // 앱 스킴 시도. 미설치 시 브라우저는 그냥 무시
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
