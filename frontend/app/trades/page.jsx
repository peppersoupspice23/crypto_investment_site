'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { marketAPI, tradeAPI, walletAPI } from '@/lib/api';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, RefreshCw } from 'lucide-react';

const CRYPTOS = ['BTC', 'ETH', 'SOL', 'USDT'];

const money = (value) =>
  Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const compactMoney = (value) =>
  Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  });

export default function TradesPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [prices, setPrices] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [walletData, holdingsData, tradesData, marketData] = await Promise.all([
        walletAPI.getWallet(),
        walletAPI.getHoldings().catch(() => ({ holdings: [], totalValueUSD: 0 })),
        tradeAPI.getHistory({ limit: 25 }).catch(() => ({ trades: [] })),
        marketAPI.getPrices(CRYPTOS).catch(() => ({ prices: {} })),
      ]);
      setWallet(walletData);
      setHoldings(holdingsData.holdings || []);
      setTradeHistory(tradesData.trades || []);
      setPrices(marketData.prices || {});
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Unable to load trading data.' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadChart = useCallback(async () => {
    try {
      const data = await marketAPI.getHistory(selectedCrypto, 7);
      setChartData((data.history || []).filter((_, index) => index % 12 === 0));
    } catch {
      setChartData([]);
    }
  }, [selectedCrypto]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
  }, [loadData, router]);

  useEffect(() => {
    loadChart();
  }, [loadChart]);

  const selectedMarket = prices[selectedCrypto] || {};
  const price = Number(selectedMarket.price || 0);
  const usdBalance = wallet?.balance || 0;
  const cryptoHolding = holdings.find((h) => h.asset === selectedCrypto);
  const cryptoOwned = cryptoHolding?.amount || 0;

  const preview = useMemo(() => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0 || !price) return null;
    if (activeTab === 'buy') {
      return {
        receive: parsed / price,
        spend: parsed,
      };
    }
    return {
      receive: parsed * price,
      spend: parsed,
    };
  }, [activeTab, amount, price]);

  const handleTrade = async (event) => {
    event.preventDefault();
    setFeedback(null);
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setFeedback({ type: 'error', message: 'Enter a valid amount.' });
      return;
    }
    if (!price) {
      setFeedback({ type: 'error', message: 'Live price is not available yet.' });
      return;
    }

    setTradeLoading(true);
    try {
      if (activeTab === 'buy') {
        await tradeAPI.buy(selectedCrypto, parsed);
        setFeedback({ type: 'success', message: `Bought ${(parsed / price).toFixed(8)} ${selectedCrypto} for ${money(parsed)}.` });
      } else {
        await tradeAPI.sell(selectedCrypto, parsed);
        setFeedback({ type: 'success', message: `Sold ${parsed} ${selectedCrypto} for ${money(parsed * price)}.` });
      }
      setAmount('');
      await loadData();
      await loadChart();
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Trade failed.' });
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Back to dashboard">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Trade</h1>
              <p className="text-sm text-slate-500">Live-price demo execution</p>
            </div>
          </div>
          <button onClick={() => { loadData(); loadChart(); }} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Refresh trading data">
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {feedback && (
          <div className={`rounded-md border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
            {feedback.message}
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <form onSubmit={handleTrade} className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-2 mb-6">
              {['buy', 'sell'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveTab(tab); setAmount(''); setFeedback(null); }}
                  className={`rounded-md py-2 text-sm font-semibold capitalize ${activeTab === tab ? (tab === 'buy' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Asset</label>
              <div className="grid grid-cols-4 gap-2">
                {CRYPTOS.map((asset) => {
                  const change = Number(prices[asset]?.change24h || 0);
                  return (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => { setSelectedCrypto(asset); setAmount(''); setFeedback(null); }}
                      className={`rounded-md border p-3 text-left ${selectedCrypto === asset ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300'}`}
                    >
                      <div className="font-semibold">{asset}</div>
                      <div className={`text-xs ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 mb-5">
              <div className="text-sm text-slate-500">Live price</div>
              <div className="text-2xl font-bold">{money(price)} / {selectedCrypto}</div>
              <div className="text-xs text-slate-400 mt-1">Source: {selectedMarket.source || 'loading'}</div>
            </div>

            <div className="flex justify-between text-sm text-slate-600 mb-4">
              <span>USD Balance: <strong className="text-slate-900">{money(usdBalance)}</strong></span>
              {activeTab === 'sell' && <span>{selectedCrypto}: <strong className="text-slate-900">{cryptoOwned.toFixed(8)}</strong></span>}
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="tradeAmount">
              {activeTab === 'buy' ? 'Amount (USD)' : `Amount (${selectedCrypto})`}
            </label>
            <div className="flex rounded-md border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-emerald-500">
              <span className="px-3 py-2 text-slate-400">{activeTab === 'buy' ? '$' : selectedCrypto}</span>
              <input
                id="tradeAmount"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                min="0"
                step="any"
                placeholder="0.00"
                className="w-full rounded-md py-2 pr-3 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {activeTab === 'buy' ? [100, 500, 1000].map((value) => (
                <button key={value} type="button" onClick={() => setAmount(String(value))} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  {money(value)}
                </button>
              )) : [0.25, 0.5, 1].map((pct) => (
                <button key={pct} type="button" onClick={() => setAmount(String((cryptoOwned * pct).toFixed(8)))} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  {pct * 100}%
                </button>
              ))}
            </div>

            {preview && (
              <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                {activeTab === 'buy'
                  ? <>Estimated receive: <strong>{preview.receive.toFixed(8)} {selectedCrypto}</strong></>
                  : <>Estimated receive: <strong>{money(preview.receive)}</strong></>}
              </div>
            )}

            <button
              type="submit"
              disabled={tradeLoading || !amount || !price}
              className={`mt-5 w-full rounded-md py-3 font-semibold text-white disabled:opacity-50 ${activeTab === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
            >
              {tradeLoading ? 'Processing...' : activeTab === 'buy' ? `Buy ${selectedCrypto}` : `Sell ${selectedCrypto}`}
            </button>
          </form>

          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">{selectedCrypto} Live Chart</h2>
                <p className="text-sm text-slate-500">7 day price movement</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{money(price)}</div>
                <div className={`text-sm ${Number(selectedMarket.change24h || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {Number(selectedMarket.change24h || 0) >= 0 ? '+' : ''}{Number(selectedMarket.change24h || 0).toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tradeChart" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tickFormatter={(value) => new Date(value).toLocaleDateString()} tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={compactMoney} tick={{ fontSize: 12 }} width={72} />
                    <Tooltip formatter={(value) => money(value)} labelFormatter={(value) => new Date(value).toLocaleString()} />
                    <Area type="monotone" dataKey="price" stroke="#059669" strokeWidth={2} fill="url(#tradeChart)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">Market history will appear when live data is reachable.</div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title="Your Holdings">
            {holdings.length > 0 ? holdings.map((holding) => (
              <div key={holding.asset} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
                <div>
                  <div className="font-semibold">{holding.asset}</div>
                  <div className="text-sm text-slate-500">{Number(holding.amount || 0).toFixed(8)}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{money(holding.valueUSD)}</div>
                  <div className="text-sm text-slate-500">{holding.percentage}%</div>
                </div>
              </div>
            )) : <Empty text="No holdings yet. Buy your first asset from the trade panel." />}
          </Panel>

          <Panel title="Trade History">
            {tradeHistory.length > 0 ? tradeHistory.map((trade) => (
              <div key={trade._id} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`rounded-md p-2 ${trade.type === 'buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {trade.type === 'buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </span>
                  <div>
                    <div className="font-semibold capitalize">{trade.type} {trade.crypto}</div>
                    <div className="text-sm text-slate-500">{new Date(trade.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{money(trade.amountUSD)}</div>
                  <div className="text-sm text-slate-500">{Number(trade.amountCrypto || 0).toFixed(8)}</div>
                </div>
              </div>
            )) : <Empty text="No trades yet." />}
          </Panel>
        </section>
      </main>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <div className="py-10 text-center text-sm text-slate-500">{text}</div>;
}
