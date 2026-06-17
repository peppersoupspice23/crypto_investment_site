export const SUPPORTED_ASSETS = ['BTC', 'ETH', 'SOL', 'USDT'];

const COIN_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  USDT: 'tether',
};

const FALLBACK_PRICES = {
  BTC: { price: 30000, change24h: 0 },
  ETH: { price: 2000, change24h: 0 },
  SOL: { price: 100, change24h: 0 },
  USDT: { price: 1, change24h: 0 },
};

const CACHE_MS = 60 * 1000;
let priceCache = null;
let priceCacheAt = 0;
const historyCache = new Map();

export const resetMarketCache = () => {
  priceCache = null;
  priceCacheAt = 0;
  historyCache.clear();
};

const buildFallbackHistory = async (symbol, days) => {
  const market = await getLivePrice(symbol);
  const price = market?.price || FALLBACK_PRICES[symbol].price;
  const points = Math.max(days * 4, 8);
  const now = Date.now();
  const interval = (days * 24 * 60 * 60 * 1000) / points;

  return Array.from({ length: points + 1 }, (_, index) => {
    const progress = index / points;
    const wave = Math.sin(progress * Math.PI * 2) * 0.018;
    const drift = (progress - 0.5) * 0.012;
    return {
      time: Math.round(now - (points - index) * interval),
      price: Number((price * (1 + wave + drift)).toFixed(2)),
      source: 'fallback',
    };
  });
};

const normalizeSymbol = (symbol) => String(symbol || '').toUpperCase();

export const isSupportedAsset = (symbol) => SUPPORTED_ASSETS.includes(normalizeSymbol(symbol));

export const getSupportedAssets = () => [...SUPPORTED_ASSETS];

export const getLivePrices = async (symbols = SUPPORTED_ASSETS) => {
  const normalized = symbols.map(normalizeSymbol).filter(isSupportedAsset);
  const now = Date.now();

  if (priceCache && now - priceCacheAt < CACHE_MS) {
    return Object.fromEntries(normalized.map((symbol) => [symbol, priceCache[symbol]]));
  }

  const ids = normalized.map((symbol) => COIN_IDS[symbol]).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent': 'level-inspired-crypto-demo/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko request failed with ${response.status}`);
    }

    const data = await response.json();
    priceCache = Object.fromEntries(
      SUPPORTED_ASSETS.map((symbol) => {
        const coin = data[COIN_IDS[symbol]];
        return [
          symbol,
          {
            price: Number(coin?.usd ?? FALLBACK_PRICES[symbol].price),
            change24h: Number(coin?.usd_24h_change ?? 0),
            source: coin?.usd ? 'coingecko' : 'fallback',
            updatedAt: new Date().toISOString(),
          },
        ];
      })
    );
    priceCacheAt = now;
  } catch (error) {
    priceCache = Object.fromEntries(
      SUPPORTED_ASSETS.map((symbol) => [
        symbol,
        {
          ...FALLBACK_PRICES[symbol],
          source: 'fallback',
          error: error.message,
          updatedAt: new Date().toISOString(),
        },
      ])
    );
    priceCacheAt = now;
  }

  return Object.fromEntries(normalized.map((symbol) => [symbol, priceCache[symbol]]));
};

export const getLivePrice = async (symbol) => {
  const normalized = normalizeSymbol(symbol);
  if (!isSupportedAsset(normalized)) return null;
  const prices = await getLivePrices([normalized]);
  return prices[normalized];
};

export const getMarketHistory = async (symbol, days = 7) => {
  const normalized = normalizeSymbol(symbol);
  if (!isSupportedAsset(normalized)) return [];

  const id = COIN_IDS[normalized];
  const safeDays = Math.min(Math.max(parseInt(days, 10) || 7, 1), 90);
  const cacheKey = `${normalized}:${safeDays}`;
  const cached = historyCache.get(cacheKey);

  if (cached && Date.now() - cached.cachedAt < CACHE_MS * 5) {
    return cached.history;
  }

  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${safeDays}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent': 'level-inspired-crypto-demo/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko history request failed with ${response.status}`);
    }

    const data = await response.json();
    const history = (data.prices || []).map(([time, price]) => ({
      time,
      price: Number(price.toFixed(2)),
      source: 'coingecko',
    }));

    historyCache.set(cacheKey, { cachedAt: Date.now(), history });
    return history;
  } catch {
    const fallbackHistory = await buildFallbackHistory(normalized, safeDays);
    historyCache.set(cacheKey, { cachedAt: Date.now(), history: fallbackHistory });
    return fallbackHistory;
  }
};
