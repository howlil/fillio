import { chromium, expect } from '@playwright/test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const extensionDir = resolve('.output/chrome-mv3');
const manifest = JSON.parse(
  await readFile(join(extensionDir, 'manifest.json'), 'utf8'),
);
const optionsPath = manifest.options_ui?.page ?? manifest.options_page;
const popupPath = manifest.action?.default_popup;

if (!optionsPath || !popupPath) {
  throw new Error(
    'Expected options and popup entrypoints in generated manifest',
  );
}

async function launchExtension(userDataDir) {
  return chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium',
    headless: true,
    args: [
      `--disable-extensions-except=${extensionDir}`,
      `--load-extension=${extensionDir}`,
    ],
  });
}

async function getExtensionId(context) {
  let [serviceWorker] = context.serviceWorkers();
  serviceWorker ??= await context.waitForEvent('serviceworker');

  const extensionId = serviceWorker.url().split('/')[2];
  if (!extensionId) {
    throw new Error(
      `Could not determine extension id from ${serviceWorker.url()}`,
    );
  }

  return extensionId;
}

const userDataDir = await mkdtemp(join(tmpdir(), 'fillio-e2e-'));
let context;

try {
  context = await launchExtension(userDataDir);
  let extensionId = await getExtensionId(context);
  let page = await context.newPage();

  await page.goto(`chrome-extension://${extensionId}/${optionsPath}`);
  await page.getByLabel('First name').fill('Smoke');
  await page.getByLabel('Last name').fill('Tester');
  await page.getByLabel('Primary email').fill('smoke@example.com');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('status')).toHaveText('Profile saved.');

  await context.close();
  context = undefined;

  context = await launchExtension(userDataDir);
  extensionId = await getExtensionId(context);
  page = await context.newPage();

  await page.goto(`chrome-extension://${extensionId}/${optionsPath}`);
  await expect(page.getByLabel('First name')).toHaveValue('Smoke');
  await expect(page.getByLabel('Last name')).toHaveValue('Tester');
  await expect(page.getByLabel('Primary email')).toHaveValue(
    'smoke@example.com',
  );

  await page.goto(`chrome-extension://${extensionId}/${popupPath}`);
  await expect(page.getByText('2 of 6 profile sections ready')).toBeVisible();
} finally {
  await context?.close();
  await rm(userDataDir, { recursive: true, force: true });
}
