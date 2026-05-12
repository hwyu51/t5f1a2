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

    // 준비물 탭
    await page.getByRole('link', { name: /준비물/ }).click();
    await expect(page).toHaveURL(/\/packing/);
    await expect(page.getByRole('heading', { name: '준비물' })).toBeVisible();

    // 장보기 탭
    await page.getByRole('link', { name: /장보기/ }).click();
    await expect(page).toHaveURL(/\/shopping/);
    await expect(page.getByRole('heading', { name: '장보기' })).toBeVisible();
  });

  test('더보기 시트로 메뉴/숙소/정산 진입', async ({ page }) => {
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

  test('일정 페이지 1/2일차 모두 표시', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /지환/ }).first().click();
    await page.getByRole('link', { name: /일정/ }).click();

    // 두 일차 헤더 모두 노출 (탭 없이 스크롤로 다 보임)
    await expect(page.getByRole('heading', { name: /1일차/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /2일차/ })).toBeVisible();

    // 1일차 항목
    await expect(page.getByText('지연이네 집합')).toBeVisible();
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

    // 관리자 배너 표시 확인 (배너는 정확히 '🔧 관리자 모드 ON'. 버튼은 '... · 종료')
    await expect(
      page.getByText('🔧 관리자 모드 ON', { exact: true }),
    ).toBeVisible();
  });
});
