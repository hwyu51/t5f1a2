import { expect, test } from '@playwright/test';

test.describe('기본 흐름', () => {
  test('첫 진입 시 멤버 선택 모달 → 멤버 선택 → 홈 표시', async ({ page }) => {
    await page.goto('/');

    // 멤버 선택 모달
    await expect(page.getByRole('heading', { name: '본인 선택' })).toBeVisible();

    // '지환' 카드 클릭 (모달의 멤버 그리드에 있음)
    await page.getByRole('button', { name: /지환/ }).first().click();

    // 모달 닫히고 홈 페이지 콘텐츠 확인
    await expect(
      page.getByRole('heading', { name: '본인 선택' }),
    ).not.toBeVisible();
    await expect(page.getByText('대천 1박2일까지')).toBeVisible();
    await expect(page.getByText(/집합 장소/)).toBeVisible();
  });

  test('하단 탭으로 페이지 이동', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /지환/ }).first().click();

    // 일정 탭
    await page.getByRole('link', { name: /일정/ }).click();
    await expect(page).toHaveURL(/\/schedule/);
    await expect(page.getByRole('heading', { name: '일정' })).toBeVisible();

    // 숙소 탭
    await page.getByRole('link', { name: /숙소/ }).click();
    await expect(page).toHaveURL(/\/lodging/);
    await expect(page.getByRole('heading', { name: '숙소' })).toBeVisible();

    // 준비물 탭
    await page.getByRole('link', { name: /준비물/ }).click();
    await expect(page).toHaveURL(/\/packing/);
    await expect(page.getByRole('heading', { name: '준비물' })).toBeVisible();
  });

  test('더보기 시트로 메뉴/장보기/정산 진입', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /지환/ }).first().click();

    // 더보기 시트 열기
    await page.getByRole('button', { name: /더보기/ }).click();
    await expect(page.getByRole('heading', { name: '더보기' })).toBeVisible();

    // 메뉴 진입
    await page.getByRole('link', { name: /메뉴.*바베큐/ }).click();
    await expect(page).toHaveURL(/\/menus/);
    await expect(page.getByRole('heading', { name: '메뉴' })).toBeVisible();
  });

  test('일정 페이지 1/2일차 토글', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /지환/ }).first().click();
    await page.getByRole('link', { name: /일정/ }).click();

    // 1일차가 기본 활성
    await expect(page.getByText('지연이네 집합')).toBeVisible();

    // 2일차 탭 클릭
    await page.getByRole('button', { name: /2일차/ }).click();

    // 2일차 항목 (체크아웃 → 게국지 순서)
    await expect(page.getByText('숙소 체크아웃')).toBeVisible();
    await expect(page.getByText('게국지 해장')).toBeVisible();
  });

  test('관리자 모드 활성화 → 배너 표시', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /지환/ }).first().click();

    // 더보기 → 관리자 모드 토글 → 비번 모달
    await page.getByRole('button', { name: /더보기/ }).click();
    await page.getByRole('button', { name: /관리자 모드/ }).click();

    // 비번 모달의 password input에 '0501' 입력 후 확인
    await page.getByRole('heading', { name: /관리자 비밀번호/ }).waitFor();
    await page.locator('input[type="password"]').fill('0501');
    await page.getByRole('button', { name: '확인' }).click();

    // 관리자 배너 표시 확인
    await expect(page.getByText(/관리자 모드 ON/)).toBeVisible();
  });
});
