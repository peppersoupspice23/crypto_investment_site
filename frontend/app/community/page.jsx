'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';

const posts = [
  { author: 'Maya', title: 'BTC breakout watchlist', body: 'Watching volume confirmation before adding demo exposure.', likes: 18 },
  { author: 'Sam', title: 'Risk rule of the week', body: 'No single demo position above 20% until the portfolio has five assets.', likes: 12 },
  { author: 'Leah', title: 'SOL thesis', body: 'Comparing network activity against price moves before the next buy.', likes: 9 },
];

export default function CommunityPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-md" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Community Feed</h1>
            <p className="text-sm text-slate-500">Starter social layer for trade ideas and portfolio learning.</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {posts.map((post) => (
          <article key={post.title} className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{post.author}</p>
                <h2 className="text-lg font-semibold mt-1">{post.title}</h2>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-slate-500"><ThumbsUp className="w-4 h-4" /> {post.likes}</span>
            </div>
            <p className="text-slate-600 mt-3">{post.body}</p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              <MessageSquare className="w-4 h-4" /> Discuss
            </button>
          </article>
        ))}
      </main>
    </div>
  );
}
