export type EmergencyContact = {
  name: string;
  phone: string;
  note?: string;
};

export const EMERGENCY: { external: EmergencyContact[] } = {
  external: [
    { name: '대천 해녀펜션', phone: '010-2371-4287', note: '대표 김만종, 카톡 @해라사이' },
    { name: '풍미꽃게장게국지', phone: '041-934-6442' },
    { name: '대천삼삼꽃게장', phone: '041-932-7775' },
    { name: '대천 스카이바이크', phone: '041-931-1180' },
    { name: '보령시축제관광재단', phone: '041-930-0891' },
    // TODO: 인근 병원/약국, 보령경찰서 → 관리자 모드에서 추가 가능
  ],
};
