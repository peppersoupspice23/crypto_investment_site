import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLivePrice,
  getLivePrices,
  getMarketHistory,
  isSupportedAsset,
  resetMarketCache,
} from './marketService.js';

test('identifies supported assets', () => {
  assert.equal(isSupportedAsset('btc'), true);
  assert.equal(isSupportedAsset('DOGE'), false);
});

test('fetches normalized live prices from CoinGecko shape', async () => {
  resetMarketCache();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      bitcoin: { usd: 65000, usd_24h_change: 1.25 },
      ethereum: { usd: 3500, usd_24h_change: -0.5 },
      solana: { usd: 160, usd_24h_change: 3.1 },
      tether: { usd: 1, usd_24h_change: 0.01 },
    }),
  });

  try {
    const prices = await getLivePrices(['BTC', 'ETH']);
    assert.equal(prices.BTC.price, 65000);
    assert.equal(prices.BTC.source, 'coingecko');
    assert.equal(prices.ETH.change24h, -0.5);

    const btc = await getLivePrice('BTC');
    assert.equal(btc.price, 65000);
  } finally {
    globalThis.fetch = originalFetch;
    resetMarketCache();
  }
});

test('maps market history to chart points', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      prices: [
        [1710000000000, 61234.567],
        [1710003600000, 61888.1],
      ],
    }),
  });

  try {
    const history = await getMarketHistory('BTC', 7);
    assert.deepEqual(history, [
      { time: 1710000000000, price: 61234.57, source: 'coingecko' },
      { time: 1710003600000, price: 61888.1, source: 'coingecko' },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    resetMarketCache();
  }
});

test('returns fallback history when CoinGecko history is unavailable', async () => {
  resetMarketCache();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes('/market_chart')) {
      return { ok: false, status: 429, json: async () => ({}) };
    }

    return {
      ok: true,
      json: async () => ({
        bitcoin: { usd: 65000, usd_24h_change: 1.25 },
        ethereum: { usd: 3500, usd_24h_change: -0.5 },
        solana: { usd: 160, usd_24h_change: 3.1 },
        tether: { usd: 1, usd_24h_change: 0.01 },
      }),
    };
  };

  try {
    const history = await getMarketHistory('BTC', 7);
    assert.equal(history.length > 0, true);
    assert.equal(history[0].source, 'fallback');
  } finally {
    globalThis.fetch = originalFetch;
    resetMarketCache();
  }
});
