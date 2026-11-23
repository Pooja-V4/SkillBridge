import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Layers, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface RoadmapItem {
  id: number;
  resourceId: number;
  skillName: string;
  resourceTitle: string;
  platform: string;
  url: string;
  difficulty: string;
  estimatedDuration: string;
  sequenceOrder: number;
  isCompleted: boolean;
}

interface RoadmapData {
  id: number;
  targetRole: string;
  completionPercentage: number;
  totalMilestones: number;
  completedMilestones: number;
  items: RoadmapItem[];
}

export const RoadmapView: React.FC = () => {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/roadmaps/me');
      setRoadmap(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load personalized roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/roadmaps/generate');
      setRoadmap(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate updated roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = async (itemId: number) => {
    setTogglingId(itemId);
    try {
      const res = await api.patch(`/roadmaps/items/${itemId}/toggle`);
      setRoadmap(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle milestone status.');
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-sky-700 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Personalized Curriculum Generator
            </div>
            <h2 className="text-2xl font-black">AI Learning Roadmap & Resource Bridge</h2>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              Sequenced milestones tailored to your identified skill gaps. Complete curated tutorials and track your verifiable progress toward {roadmap?.targetRole || 'your target role'}.
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="bg-white text-indigo-800 hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Re-Generating...' : 'Regenerate Milestones'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {roadmap && (
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl">
                {Math.round(roadmap.completionPercentage)}%
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Roadmap Progress</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {roadmap.completedMilestones} of {roadmap.totalMilestones} learning milestones completed
                </p>
              </div>
            </div>

            <div className="w-full md:w-72 bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmap.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Milestone Items Timeline List */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Curated Learning Modules ({roadmap.items.length})
            </h3>

            <div className="space-y-3">
              {roadmap.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    item.isCompleted
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleMilestone(item.id)}
                      disabled={togglingId === item.id}
                      className="mt-1 text-slate-400 hover:text-indigo-600 transition cursor-pointer flex-shrink-0"
                      title={item.isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {item.skillName}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Step {index + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.difficulty === 'BEGINNER' ? 'bg-sky-50 text-sky-700' :
                          item.difficulty === 'INTERMEDIATE' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {item.difficulty}
                        </span>
                      </div>

                      <h4 className={`text-base font-bold ${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {item.resourceTitle}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="font-medium text-slate-600">{item.platform}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.estimatedDuration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition flex items-center gap-1.5 self-end sm:self-center flex-shrink-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    Open Tutorial
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RoadmapView;
