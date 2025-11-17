import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Award, Target, TrendingUp, Zap } from "lucide-react";
import StatsCard from "../components/progress/StatsCard";

export default function Progress() {
  const { data: words = [] } = useQuery({
    queryKey: ['words'],
    queryFn: () => base44.entities.Word.list(),
  });

  const totalWords = words.length;
  const masteredWords = words.filter(w => w.mastered).length;
  const totalPracticed = words.reduce((sum, w) => sum + (w.times_practiced || 0), 0);
  const avgPractice = totalWords > 0 ? Math.round(totalPracticed / totalWords) : 0;

  const categoryStats = words.reduce((acc, word) => {
    const cat = word.category || 'other';
    if (!acc[cat]) {
      acc[cat] = { total: 0, mastered: 0 };
    }
    acc[cat].total++;
    if (word.mastered) acc[cat].mastered++;
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Your Progress
          </h1>
          <p className="text-gray-500">Track your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Words"
            value={totalWords}
            icon={Target}
            gradient="from-violet-500 to-purple-500"
            delay={0}
          />
          <StatsCard
            title="Mastered"
            value={masteredWords}
            icon={Award}
            gradient="from-emerald-500 to-green-500"
            delay={0.1}
          />
          <StatsCard
            title="Practice Sessions"
            value={totalPracticed}
            icon={Zap}
            gradient="from-blue-500 to-cyan-500"
            delay={0.2}
          />
          <StatsCard
            title="Avg. Practice"
            value={avgPractice}
            icon={TrendingUp}
            gradient="from-orange-500 to-pink-500"
            delay={0.3}
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100 shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 capitalize">
                      {category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {stats.mastered} / {stats.total} mastered
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(categoryStats).length === 0 && (
              <p className="text-center text-gray-400 py-8">No categories yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}