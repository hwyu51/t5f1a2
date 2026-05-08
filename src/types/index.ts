export type Member = {
  id: string;
  name: string;
  emoji?: string;
  mbti?: string;
  isDriver?: boolean;
  confirmed: boolean;
};

export type ScheduleItem = {
  id: string;
  day: number;
  time: string;
  title: string;
  placeId?: string;
  placeOptions?: string[];
  note?: string;
};

export type Place = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: '집합' | '경유' | '숙소' | '마트' | '식당' | '관광' | '병원' | '기타';
  note?: string;
};

export type Menu = {
  id: string;
  name: string;
  category: '식사' | '안주' | '간식';
  servings?: number;
  notes?: string;
  ingredients: Ingredient[];
};

export type Ingredient = {
  name: string;
  amount: string;
  category: '정육' | '채소' | '과일' | '소스/양념' | '주류' | '음료' | '잡화';
  note?: string;
  optional?: boolean;
};

export type MenuSlot = {
  round: 1 | 2 | 3 | 4;
  menuIds: string[];
};

export type IngredientCheck = {
  key: string;
  checked: boolean;
  updatedAt: number;
};

export type MenuComment = {
  id: string;
  menuId: string;
  authorId: string;
  text: string;
  createdAt: number;
};

export type PackingItem = {
  id: string;
  name: string;
  type: '공용' | '개인';
  assigneeId?: string;
};

export type PackingCheck = {
  itemId: string;
  checked: boolean;
};

export type Receipt = {
  url: string;
  thumbnailUrl?: string;
  filename: string;
  uploadedAt: number;
};

export type Expense = {
  id: string;
  payerId: string;
  amount: number;
  memo: string;
  // 분담 방식
  // - 'all': 모든 멤버가 N분의1 (펜션비, 렌트비, 장보기 등)
  // - 'subset': participantIds에 적힌 사람만 N분의1 (머드축제 입장권, 스카이바이크 등)
  splitMode: 'all' | 'subset';
  participantIds?: string[]; // splitMode='subset'일 때만
  date: string;
  createdAt: number;
  receipts?: Receipt[];
  pending?: boolean; // 예정 지출 (정산 대상에서 제외)
};

export type PlaceNote = {
  id: string;
  placeId: string;
  authorId: string;
  text: string;
  createdAt: number;
};

export type Arrival = {
  memberId: string;
  arrivedAt: number;
};

export type ScheduleOverride = {
  scheduleItems: ScheduleItem[];
  updatedAt: number;
};

export type MenuOverride = {
  menus: Menu[];
  updatedAt: number;
};

export type AppSettings = {
  car2DriverId?: string;
  jongminConfirmed?: boolean;
  updatedAt: number;
};
