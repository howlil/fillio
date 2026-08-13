import { chromium, expect } from '@playwright/test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const extensionDir = resolve('.output/chrome-mv3');
const manifest = JSON.parse(await readFile(join(extensionDir, 'manifest.json'), 'utf8'));
const optionsPath = manifest.options_ui?.page ?? manifest.options_page;
if (!optionsPath) throw new Error('Expected options entrypoint');

const html = `<!doctype html><html><body>
<form id="application" action="/apply" method="post">
<section id="step"><h2>Candidate</h2>
<label for="email">Email</label><input id="email" name="email" type="email" />
<label for="name">Name</label><input id="name" name="name" />
</section></form></body></html>`;

async function fixtureServer() {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
  });
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('No fixture port');
  return { server, url: `http://127.0.0.1:${address.port}/apply` };
}

async function extensionId(context) {
  let [worker] = context.serviceWorkers();
  worker ??= await context.waitForEvent('serviceworker');
  const id = worker.url().split('/')[2];
  if (!id) throw new Error('No extension id');
  return id;
}

const dataDir = await mkdtemp(join(tmpdir(), 'fillio-i3-'));
const fixture = await fixtureServer();
let context;

try {
  context = await chromium.launchPersistentContext(dataDir, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionDir}`, `--load-extension=${extensionDir}`],
  });
  const id = await extensionId(context);
  const page = await context.newPage();

  await page.goto(`chrome-extension://${id}/${optionsPath}`);
  await page.getByLabel('First name').fill('Smoke');
  await page.getByLabel('Primary email').fill('smoke@example.com');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('status')).toHaveText('Profile saved.');

  await page.goto(fixture.url);
  await expect(page.getByText('1 needs review')).toBeVisible();
  await page.getByRole('button', { name: 'Use personal.legalName.first for Name' }).click();
  await expect(page.getByLabel('Name')).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Fill 2 ready fields' })).toBeVisible();

  await page.evaluate(() => {
    document.querySelector('#step').innerHTML = '<h2>Second step</h2><label for="step-email">Email</label><input id="step-email" name="step_email" type="email" />';
  });
  await expect(page.getByRole('button', { name: 'Fill 1 ready field' })).toBeVisible();
  await expect(page.getByLabel('Email')).toHaveValue('');

  await page.reload();
  await expect(page.getByRole('button', { name: 'Fill 2 ready fields' })).toBeVisible();
  await expect(page.getByText('0 needs review')).toBeVisible();
  await expect(page.getByLabel('Name')).toHaveValue('');
} finally {
  await context?.close();
  await new Promise((resolvePromise) => fixture.server.close(resolvePromise));
  await rm(dataDir, { recursive: true, force: true });
}
