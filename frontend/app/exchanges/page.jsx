'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';

const exchanges = [
  { name: 'Coinbase', fees: '0.40% maker / 0.60% taker', assets: '250+', strengths: 'Beginner-friendly UX, strong fiat rails', bestFor: 'New retail users' },
  { name: 'Binance', fees: '0.10% spot baseline', assets: '350+', strengths: 'Deep liquidity, advanced order types', bestFor: 'High-volume traders' },
  { name: 'Kraken', fees: '0.25% maker / 0.40% taker', assets: '200+', strengths: 'Security reputation, pro trading tools', bestFor: 'Security-conscious users' },
  { name: 'OKX', fees: '0.08% maker / 0.10% taker', assets: '300+', strengths: 'Derivatives, Web3 wallet ecosystem', bestFor: 'Advanced global users' },
];

export default function ExchangesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Exchange Comparison</h1>
            <p className="text-sm text-slate-500">A decision table for the eventual live trading direction.</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="p-4">Exchange</th>
                <th className="p-4">Typical fees</th>
                <th className="p-4">Assets</th>
                <th className="p-4">Strengths</th>
                <th className="p-4">Best for</th>
                <th className="p-4">Fit</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((exchange) => (
                <tr key={exchange.name} className="border-t border-slate-100">
                  <td className="p-4 font-semibold">{exchange.name}</td>
                  <td className="p-4">{exchange.fees}</td>
                  <td className="p-4">{exchange.assets}</td>
                  <td className="p-4">{exchange.strengths}</td>
                  <td className="p-4">{exchange.bestFor}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> Candidate
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['API access and account-linking research', 'Fee-aware trade quote model', 'Compliance and risk checklist'].map((item) => (
            <div key={item} className="bg-white border border-slate-200 rounded-lg p-5">
              <ExternalLink className="w-5 h-5 text-emerald-600 mb-3" />
              <h2 className="font-semibold">{item}</h2>
              <p className="text-sm text-slate-500 mt-2">Next live-trading prep item before any real account execution is enabled.</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
