import { test, expect } from '@playwright/test';

test.describe('UX Logic Thread — Interactive Canvas E2E Suite (Bahasa Indonesia)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the React Flow canvas to mount
    await expect(page.locator('.react-flow')).toBeVisible({ timeout: 10_000 });
  });

  test('1. App loads full-screen MindMap Canvas with branding and controls', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/UX Logic Thread/i);

    // Check Top Bar branding logo
    await expect(page.getByAltText(/UX Logic Thread/i)).toBeVisible();

    // Check Bottom Dock tools (Indonesian copy)
    await expect(page.getByTitle(/Alat Pilih/i)).toBeVisible();
    await expect(page.getByTitle(/Alat Geser/i)).toBeVisible();
    await expect(page.getByTitle(/Tambah Insight Riset/i)).toBeVisible();
    await expect(page.getByTitle(/Tambah Fitur/i)).toBeVisible();
    await expect(page.getByTitle(/Tambah Layar Sitemap/i)).toBeVisible();
    await expect(page.getByTitle(/Tambah Token UI/i)).toBeVisible();

    // Verify initial seed nodes rendered on the canvas
    const flowNodes = page.locator('.react-flow__node');
    await expect(flowNodes.first()).toBeVisible();
    const count = await flowNodes.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('2. Cursor tool mode switches between Select (V) and Hand (H)', async ({ page }) => {
    const selectBtn = page.getByTitle(/Alat Pilih/i);
    const handBtn = page.getByTitle(/Alat Geser/i);

    // Initial default or click Select
    await selectBtn.click();
    await expect(selectBtn).toHaveClass(/bg-zinc-800/);

    // Click Hand
    await handBtn.click();
    await expect(handBtn).toHaveClass(/bg-zinc-800/);

    // Test Keyboard Shortcut V -> Select
    await page.keyboard.press('v');
    await expect(selectBtn).toHaveClass(/bg-zinc-800/);

    // Test Keyboard Shortcut H -> Hand
    await page.keyboard.press('h');
    await expect(handBtn).toHaveClass(/bg-zinc-800/);
  });

  test('3. Dependency Lineage Focus Mode activates on node click and clears on Esc', async ({ page }) => {
    const firstNode = page.locator('.react-flow__node').first();
    await expect(firstNode).toBeVisible();

    // Click on node to activate Lineage Focus Mode
    await firstNode.click();

    // Verify Floating Lineage Pill appears with Indonesian copy
    const lineagePill = page.getByText(/Fokus Silsilah/i);
    await expect(lineagePill).toBeVisible();

    // Clear via Escape key
    await page.keyboard.press('Escape');
    await expect(lineagePill).not.toBeVisible();
  });

  test('4. Add new Research node via Bottom Dock modal', async ({ page }) => {
    const addResearchBtn = page.getByTitle(/Tambah Insight Riset/i);
    await addResearchBtn.click();

    // Dialog appears
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Tambah Insight Riset', { exact: false })).toBeVisible();

    // Fill in insight text
    const textarea = dialog.locator('textarea');
    const testInsight = `Hasil Riset Otomatis E2E ${Date.now()}`;
    await textarea.fill(testInsight);

    // Submit form (Indonesian button text)
    const submitBtn = dialog.getByRole('button', { name: /Tambah ke Kanvas/i });
    await submitBtn.click();

    // Modal closes
    await expect(dialog).not.toBeVisible();

    // Verify node text appears in canvas
    await expect(page.getByText(testInsight)).toBeVisible({ timeout: 5_000 });
  });

  test('5. Edit node modal triggers on double-click', async ({ page }) => {
    const firstNode = page.locator('.react-flow__node').first();
    await expect(firstNode).toBeVisible();

    // Double-click to open edit modal
    await firstNode.dblclick();

    // Edit Dialog appears
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: /Ubah/i })).toBeVisible();

    // Close with Batal (Cancel) or Escape
    const cancelBtn = dialog.getByRole('button', { name: /Batal/i });
    await cancelBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('6. Export AI Context drawer opens via button and shortcut (Ctrl+Shift+E)', async ({ page }) => {
    // Open via TopBar button
    const exportBtn = page.getByRole('button', { name: /(?:Kompilasi Prompt AI|Ekspor Konteks AI)/i });
    await exportBtn.click();

    // Drawer opens
    const drawer = page.getByRole('dialog', { name: /(?:Studio Kompilasi Konteks AI|Pusat Ekspor Konteks AI)/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('button', { name: /Claude/i })).toBeVisible();
    await expect(drawer.getByRole('button', { name: /Cursor/i })).toBeVisible();

    // Close drawer
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();

    // Open via keyboard shortcut (Control+Shift+E)
    await page.keyboard.press('Control+Shift+E');
    await expect(drawer).toBeVisible({ timeout: 5_000 });

    // Close again
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });

  test('7. Edge selection and disconnection via [Lepas Hubungan] button and keyboard Delete', async ({ page }) => {
    // Verify initial edges exist
    const edges = page.locator('.react-flow__edge');
    await expect(edges.first()).toBeVisible({ timeout: 5_000 });
    const initialEdgeCount = await edges.count();
    expect(initialEdgeCount).toBeGreaterThanOrEqual(2);

    // Initial node count
    const initialNodeCount = await page.locator('.react-flow__node').count();

    // Click on the first edge to select it
    const firstEdge = edges.first();
    const edgePath = firstEdge.locator('path').first();
    await edgePath.click({ force: true });

    // Verify [× Lepas Hubungan] button appears right on the edge
    const disconnectBtn = page.getByRole('button', { name: /(?:Lepas Hubungan|Putuskan)/i }).first();
    await expect(disconnectBtn).toBeVisible({ timeout: 5_000 });

    // Verify Floating Cable Pill appears at the top
    const cablePill = page.getByText(/kabel dipilih/i);
    await expect(cablePill).toBeVisible();

    // Click the [Lepas Hubungan] button to sever connection
    await disconnectBtn.click();

    // Verify edge count decreased by 1
    await expect(edges).toHaveCount(initialEdgeCount - 1, { timeout: 5_000 });

    // Verify node count remains identical (node is unlinked, not deleted!)
    const afterDisconnectNodeCount = await page.locator('.react-flow__node').count();
    expect(afterDisconnectNodeCount).toBe(initialNodeCount);

    // Now test keyboard Delete on another edge
    const nextEdge = edges.first();
    await nextEdge.locator('path').first().click({ force: true });
    await expect(page.getByRole('button', { name: /(?:Lepas Hubungan|Putuskan)/i }).first()).toBeVisible({ timeout: 5_000 });

    // Press Delete to disconnect
    await page.keyboard.press('Delete');

    // Verify edge count decreased again
    await expect(edges).toHaveCount(initialEdgeCount - 2, { timeout: 5_000 });

    // Verify nodes still exist
    const finalNodeCount = await page.locator('.react-flow__node').count();
    expect(finalNodeCount).toBe(initialNodeCount);
  });

  test('8. Create unlinked/standalone node without parent and verify "Draf Mandiri" badge (EC-1)', async ({ page }) => {
    const addFeatureBtn = page.getByTitle(/Tambah Fitur/i);
    await addFeatureBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Select "(Opsional) Tanpa Induk"
    const parentSelect = dialog.locator('select');
    await parentSelect.selectOption({ value: '' });

    // Fill feature name
    const nameInput = dialog.locator('input[type="text"]');
    const testFeatureName = `Fitur Mandiri E2E ${Date.now()}`;
    await nameInput.fill(testFeatureName);

    // Submit
    const submitBtn = dialog.getByRole('button', { name: /Tambah ke Kanvas/i });
    await submitBtn.click();
    await expect(dialog).not.toBeVisible();

    // Verify node exists on canvas
    const newFeatureNode = page.locator('.react-flow__node', { hasText: testFeatureName });
    await expect(newFeatureNode).toBeVisible({ timeout: 5_000 });

    // Verify "Draf Mandiri" badge is rendered
    await expect(newFeatureNode.getByText(/(?:Draf Mandiri|Belum Terhubung)/i)).toBeVisible();
  });

  test('9. Cascade Deletion Confirmation Dialog shows breakdown and protects children (EC-6)', async ({ page }) => {
    // Locate the first research node
    const researchNode = page.locator('.react-flow__node').first();
    await expect(researchNode).toBeVisible();

    // Hover over node to reveal trash button
    await researchNode.hover();
    const trashBtn = researchNode.getByTitle(/Hapus Insight/i);
    await expect(trashBtn).toBeVisible();
    await trashBtn.click();

    // Verify Cascade Confirmation Dialog appears
    const confirmModal = page.getByRole('dialog');
    await expect(confirmModal).toBeVisible();
    await expect(page.getByText(/Hapus Node & Silsilah Turunannya/i)).toBeVisible();
    await expect(page.getByText(/Fitur Solusi/i)).toBeVisible();

    // Click "Batal" to cancel deletion
    const cancelBtn = confirmModal.getByRole('button', { name: /Batal/i });
    await cancelBtn.click();
    await expect(confirmModal).not.toBeVisible();

    // Verify research node is still intact on canvas
    await expect(researchNode).toBeVisible();
  });
});
