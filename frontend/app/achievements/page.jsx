'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, Lock } from 'lucide-react';

const achievements = [
  { name: 'First Trade', status: 'Unlocked', detail: 'Execute one demo buy or sell.' },
  { name: 'Balanced Basket', status: 'Locked', detail: 'Hold three non-USD assets at once.' },
  { name: 'Risk Manager', status: 'Locked', detail: 'Make five trades without using more than 25% cash in one trade.' },
  { name: 'Market Watcher', status: 'Locked', detail: 'Review live prices on three separate days.' },
];

export default function AchievementsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Achievements</h1>
            <p className="text-sm text-slate-500">Learning badges for the demo trading journey.</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item) => {
          const unlocked = item.status === 'Unlocked';
          return (
            <div key={item.name} className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div className={`rounded-lg p-3 ${unlocked ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  {unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${unlocked ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{item.status}</span>
              </div>
              <h2 className="font-semibold mt-4">{item.name}</h2>
              <p className="text-sm text-slate-500 mt-2">{item.detail}</p>
            </div>
          );
        })}
      </main>
    </div>
  );
}
