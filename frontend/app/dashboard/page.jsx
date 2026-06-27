'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, marketAPI, tradeAPI, walletAPI } from '@/lib/api';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  Coins,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

const ASSETS = ['BTC', 'ETH', 'SOL', 'USDT'];
const COLORS = ['#059669', '#16a34a', '#84cc16', '#0d9488', '#64748b'];

const money = (value) =>
  Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const shortMoney = (value) =>
  Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  });

export default function DashboardPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [market, setMarket] = useState({});
  const [chartData, setChartData] = useState([]);
  const [cashAmount, setCashAmount] = useState('');
  const [cashMode, setCashMode] = useState('deposit');
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [walletData, holdingsData, performanceData, tradesData, transactionsData, marketData, historyData] =
        await Promise.all([
          walletAPI.getWallet(),
          walletAPI.getHoldings().catch(() => ({ holdings: [], totalValueUSD: 0 })),
          walletAPI.getPerformance().catch(() => null),
          tradeAPI.getHistory({ limit: 5 }).catch(() => ({ trades: [] })),
          walletAPI.getTransactions({ limit: 6 }).catch(() => ({ transactions: [] })),
          marketAPI.getPrices(ASSETS).catch(() => ({ prices: {} })),
          marketAPI.getHistory('BTC', 7).catch(() => ({ history: [] })),
        ]);

      setWallet(walletData);
      setHoldings(holdingsData.holdings || []);
      setPerformance(performanceData);
      setRecentTrades(tradesData.trades || []);
      setTransactions(transactionsData.transactions || []);
      setMarket(marketData.prices || {});
      setChartData((historyData.history || []).filter((_, index) => index % 12 === 0));
    } catch (error) {
      setNotice({ type: 'error', message: error.response?.data?.message || 'Unable to load dashboard data.' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [loadDashboardData, router]);

  const portfolioValue = wallet?.totalValueUSD ?? holdings.reduce((sum, h) => sum + (h.valueUSD || 0), 0);
  const cashBalance = wallet?.balance || 0;
  const profitLoss = performance?.profitLoss || 0;
  const profitLossPercent = Number(performance?.profitLossPercent || 0);
  const isProfit = profitLoss >= 0;

  const allocationData = useMemo(
    () => holdings.filter((holding) => holding.valueUSD > 0),
    [holdings]
  );

  const performanceBars = [
    { name: 'Deposits', value: performance?.totalDeposits || 0 },
    { name: 'Withdrawals', value: performance?.totalWithdrawals || 0 },
    { name: 'Trade volume', value: performance?.totalTradeVolume || 0 },
  ];

  const handleCashAction = async (event) => {
    event.preventDefault();
    setNotice(null);
    const amount = Number(cashAmount);
    if (!amount || amount <= 0) {
      setNotice({ type: 'error', message: 'Enter a valid USD amount.' });
      return;
    }

    try {
      if (cashMode === 'deposit') {
        await walletAPI.deposit(amount);
        setNotice({ type: 'success', message: `Deposited ${money(amount)} into demo cash.` });
      } else {
        await walletAPI.withdraw(amount);
        setNotice({ type: 'success', message: `Withdrew ${money(amount)} from demo cash.` });
      }
      setCashAmount('');
      await loadDashboardData();
    } catch (error) {
      setNotice({ type: 'error', message: error.response?.data?.message || 'Cash action failed.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading Level-inspired workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">LX</div>
            <div>
              <h1 className="text-xl font-bold">Level Inspired</h1>
              <p className="text-sm text-slate-500">Live demo trading portfolio</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {[
              ['Trade', '/trades'],
              ['Exchanges', '/exchanges'],
              ['Community', '/community'],
              ['Achievements', '/achievements'],
              ['Admin', '/admin'],
            ].map(([label, href]) => (
              <button key={href} onClick={() => router.push(href)} className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                {label}
              </button>
            ))}
            <button onClick={loadDashboardData} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Refresh dashboard">
              <RefreshCw className={`w-5 h-5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={authAPI.logout} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Logout">
              <LogOut className="w-5 h-5 text-slate-600" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {notice && (
          <div className={`rounded-md border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
            {notice.message}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {ASSETS.map((asset) => {
            const item = market[asset];
            const change = Number(item?.change24h || 0);
            return (
              <div key={asset} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{asset}</span>
                  <span className={change >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
                </div>
                <div className="mt-2 text-2xl font-bold">{money(item?.price || 0)}</div>
                <div className="mt-1 text-xs text-slate-400">Source: {item?.source || 'loading'}</div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-500">Portfolio value</p>
                <h2 className="text-4xl font-bold mt-1">{money(portfolioValue)}</h2>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${isProfit ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {isProfit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {money(profitLoss)} ({profitLossPercent.toFixed(2)}%)
              </div>
            </div>
            <div className="h-72">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="btcLine" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tickFormatter={(value) => new Date(value).toLocaleDateString()} tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={shortMoney} tick={{ fontSize: 12 }} width={72} />
                    <Tooltip formatter={(value) => money(value)} labelFormatter={(value) => new Date(value).toLocaleString()} />
                    <Area type="monotone" dataKey="price" stroke="#059669" fill="url(#btcLine)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">Live BTC chart will appear when market data is reachable.</div>
              )}
            </div>
          </div>

          <form onSubmit={handleCashAction} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Demo Cash</h2>
            </div>
            <p className="text-sm text-slate-500">Available USD</p>
            <p className="text-3xl font-bold mt-1 mb-5">{money(cashBalance)}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['deposit', 'withdraw'].map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setCashMode(mode)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${cashMode === mode ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <label className="text-sm font-medium text-slate-700" htmlFor="cashAmount">Amount</label>
            <div className="mt-1 flex rounded-md border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-emerald-500">
              <span className="px-3 py-2 text-slate-400">$</span>
              <input
                id="cashAmount"
                type="number"
                min="0"
                step="any"
                value={cashAmount}
                onChange={(event) => setCashAmount(event.target.value)}
                className="w-full rounded-md py-2 pr-3 outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[100, 500, 1000].map((value) => (
                <button key={value} type="button" onClick={() => setCashAmount(String(value))} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  {money(value)}
                </button>
              ))}
            </div>
            <button type="submit" className="mt-5 w-full rounded-md bg-slate-950 text-white py-3 font-semibold hover:bg-slate-800">
              {cashMode === 'deposit' ? 'Add Demo Cash' : 'Withdraw Demo Cash'}
            </button>
          </form>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <Coins className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Allocation</h2>
            </div>
            <div className="h-64">
              {allocationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocationData} dataKey="valueUSD" nameKey="asset" innerRadius={58} outerRadius={92} paddingAngle={3}>
                      {allocationData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => money(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">No holdings yet.</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Performance Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Metric icon={BadgeDollarSign} label="Net deposits" value={money(performance?.netDeposits)} />
              <Metric icon={ShieldCheck} label="Trades" value={performance?.totalTrades || 0} />
              <Metric icon={Wallet} label="Account age" value={`${performance?.accountAge || 0} days`} />
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={shortMoney} tick={{ fontSize: 12 }} width={72} />
                  <Tooltip formatter={(value) => money(value)} />
                  <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataPanel title="Holdings">
            {holdings.length > 0 ? holdings.map((holding) => (
              <div key={holding.asset} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
                <div>
                  <div className="font-semibold">{holding.asset}</div>
                  <div className="text-sm text-slate-500">{Number(holding.amount || 0).toFixed(8)} units at {money(holding.price)}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{money(holding.valueUSD)}</div>
                  <div className="text-sm text-slate-500">{holding.percentage}%</div>
                </div>
              </div>
            )) : <EmptyState text="Deposit demo cash and buy your first asset." />}
          </DataPanel>

          <DataPanel title="Recent Activity">
            {recentTrades.length > 0 ? recentTrades.map((trade) => (
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
            )) : transactions.length > 0 ? transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
                <div>
                  <div className="font-semibold capitalize">{transaction.description || transaction.type}</div>
                  <div className="text-sm text-slate-500">{new Date(transaction.createdAt).toLocaleString()}</div>
                </div>
                <div className="font-semibold">{money(transaction.amountUSD)}</div>
              </div>
            )) : <EmptyState text="Your deposits, withdrawals, and trades will appear here." />}
          </DataPanel>
        </section>
      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <Icon className="w-5 h-5 text-emerald-600 mb-3" />
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function DataPanel({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="py-10 text-center text-sm text-slate-500">{text}</div>;
}
