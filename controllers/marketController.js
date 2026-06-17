import {
  getLivePrices,
  getMarketHistory,
  getSupportedAssets,
  isSupportedAsset,
} from '../services/marketService.js';

export const getPrices = async (req, res) => {
  try {
    const symbols = req.query.symbols
      ? req.query.symbols.split(',').map((symbol) => symbol.trim())
      : getSupportedAssets();

    const prices = await getLivePrices(symbols);
    res.json({ prices, supportedAssets: getSupportedAssets() });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch market prices', error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const symbol = String(req.params.symbol || '').toUpperCase();
    if (!isSupportedAsset(symbol)) {
      return res.status(400).json({ message: 'Unsupported asset' });
    }

    const history = await getMarketHistory(symbol, req.query.days);
    res.json({ symbol, history });
  } catch (error) {
    res.status(502).json({ message: 'Unable to fetch market history', error: error.message });
  }
};
