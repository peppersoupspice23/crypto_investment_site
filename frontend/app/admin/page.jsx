'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, ShieldAlert, Users } from 'lucide-react';

const rows = [
  ['Users', 'User listing and role management', 'Planned'],
  ['Trades', 'Monitor demo trade volume and suspicious patterns', 'Starter'],
  ['Market data', 'Watch live price source health and fallback usage', 'Starter'],
  ['Content', 'Moderate community posts and achievement rules', 'Planned'],
];

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Operational view for the demo platform.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat icon={Users} label="User controls" value="Planned" />
          <Stat icon={Database} label="Market health" value="Live API" />
          <Stat icon={ShieldAlert} label="Risk review" value="Manual" />
        </section>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="p-4">Area</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([area, purpose, status]) => (
                <tr key={area} className="border-t border-slate-100">
                  <td className="p-4 font-semibold">{area}</td>
                  <td className="p-4">{purpose}</td>
                  <td className="p-4"><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <Icon className="w-5 h-5 text-emerald-600 mb-3" />
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
