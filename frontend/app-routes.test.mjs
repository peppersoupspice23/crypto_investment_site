import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = [
  'app/dashboard/page.jsx',
  'app/trades/page.jsx',
  'app/exchanges/page.jsx',
  'app/community/page.jsx',
  'app/achievements/page.jsx',
  'app/admin/page.jsx',
];

test('core app routes exist', async () => {
  for (const route of routes) {
    const source = await readFile(route, 'utf8');
    assert.match(source, /export default function/);
  }
});

test('frontend API client exposes market and wallet actions', async () => {
  const source = await readFile('lib/api.js', 'utf8');
  assert.match(source, /export const marketAPI/);
  assert.match(source, /getPrices/);
  assert.match(source, /getHistory/);
  assert.match(source, /deposit/);
  assert.match(source, /withdraw/);
});
