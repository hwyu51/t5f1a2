import type { Ingredient, Menu, MenuSlot } from '../types';

export type IngredientSource = {
  menuName: string;
  amount: string;
  note?: string;
  optional?: boolean;
};

export type AggregatedIngredient = {
  key: string; // category:name (체크박스 키)
  name: string;
  category: Ingredient['category'];
  sources: IngredientSource[];
};

export type AggregatedGroup = {
  category: Ingredient['category'];
  items: AggregatedIngredient[];
};

const CATEGORY_ORDER: Ingredient['category'][] = [
  '정육',
  '채소',
  '과일',
  '소스/양념',
  '주류',
  '음료',
  '잡화',
];

export function aggregateIngredients(
  slots: MenuSlot[],
  menus: Menu[],
): AggregatedGroup[] {
  const map = new Map<string, AggregatedIngredient>();

  // 슬롯의 메뉴 → 식재료 수집
  for (const slot of slots) {
    for (const menuId of slot.menuIds) {
      const menu = menus.find((m) => m.id === menuId);
      if (!menu) continue;
      for (const ing of menu.ingredients) {
        const key = `${ing.category}:${ing.name}`;
        const existing = map.get(key);
        const source: IngredientSource = {
          menuName: menu.name,
          amount: ing.amount,
          note: ing.note,
          optional: ing.optional,
        };
        if (existing) {
          existing.sources.push(source);
        } else {
          map.set(key, {
            key,
            name: ing.name,
            category: ing.category,
            sources: [source],
          });
        }
      }
    }
  }

  // 카테고리별 그룹화 + 정렬
  const grouped = new Map<Ingredient['category'], AggregatedIngredient[]>();
  for (const item of map.values()) {
    const arr = grouped.get(item.category) ?? [];
    arr.push(item);
    grouped.set(item.category, arr);
  }
  for (const arr of grouped.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }

  return CATEGORY_ORDER.flatMap((category) => {
    const items = grouped.get(category);
    if (!items || items.length === 0) return [];
    return [{ category, items }];
  });
}

export function flatItems(groups: AggregatedGroup[]): AggregatedIngredient[] {
  return groups.flatMap((g) => g.items);
}
