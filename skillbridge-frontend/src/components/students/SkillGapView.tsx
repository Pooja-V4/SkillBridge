import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Target, CheckCircle, AlertCircle, ArrowRight, Brain, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SkillEvaluation {
  skillId: number;
  skillName: string;
  requiredLevel: number;
  studentLevel: number;
  gap: number;
  weight: number;
  isMandatory: boolean;
  status: string; // MATCHED, PARTIAL, MISSING
  priority: string;
}

interface SkillGapResult {
  targetRole: string;
  overallMatchPercentage: number;
  totalRequiredSkills: number;
  matchedSkillsCount: number;
  partialSkillsCount: number;
  missingSkillsCount: number;
  evaluations: SkillEvaluation[];
  summaryMessage: string;
}

interface JobRole {
  id: number;
  title: string;
  category: string;
  description: string;
}

export const SkillGapView: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available jobs or standard roles
    api.get('/jobs')
      .then(res => {
        const roles = res.data.map((j: any) => ({
          id: j.id,
          title: j.title + ' (' + (j.companyName || 'Standard Role') + ')',
          category: j.jobType,
          description: j.description
        }));
        setJobRoles(roles);
        if (roles.length > 0) {
          setSelectedRoleId(roles[0].id);
        }
      })
      .catch(() => {
        // Fallback or handle error
      });
  }, []);

  const handleRunAnalysis = async () => {
    if (!selectedRoleId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/skill-gap', { targetJobId: selectedRoleId });
      setAnalysis(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to perform AI Skill Gap analysis. Ensure your profile has skills added.');
    } finally {
      setLoading(false);
    }
  };

  const matchedSkills = analysis?.evaluations.filter(e => e.status === 'MATCHED') || [];
  const deficitSkills = analysis?.evaluations.filter(e => e.status !== 'MATCHED') || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-7 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md mb-2">
              <Brain className="w-3.5 h-3.5" /> AI Microservice Engine v1.0
            </span>
            <h2 className="text-2xl font-black">Targeted Skill Gap Analysis</h2>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Compare your validated skills against industry benchmarks. Our algorithm calculates mathematical proficiency deficits and surfaces your personalized learning needs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedRoleId || ''}
              onChange={(e) => setSelectedRoleId(Number(e.target.value))}
              aria-label="Select Target Position for Skill Gap Analysis"
              className="bg-white/10 border border-white/20 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-md"
            >
              {jobRoles.map((role) => (
                <option key={role.id} value={role.id} className="text-slate-900">
                  {role.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleRunAnalysis}
              disabled={loading || !selectedRoleId}
              className="bg-white text-indigo-700 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Evaluating...' : 'Analyze Gap'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Top Score Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl">
                {Math.round(analysis.overallMatchPercentage)}%
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Match</div>
                <div className="text-base font-bold text-slate-800">
                  {analysis.overallMatchPercentage >= 75 ? 'Job Ready' : analysis.overallMatchPercentage >= 50 ? 'Moderate Gap' : 'Needs Preparation'}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xl">
                {analysis.matchedSkillsCount}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matched Skills</div>
                <div className="text-xs font-semibold text-emerald-700">Satisfies Benchmark</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xl">
                {analysis.missingSkillsCount + analysis.partialSkillsCount}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Deficits</div>
                <div className="text-xs font-semibold text-amber-700">Improvement Areas</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Role</div>
                <div className="text-sm font-bold text-slate-800 truncate max-w-[140px]">{analysis.targetRole}</div>
              </div>
            </div>
          </div>

          {/* Missing Skills & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deficit / Missing Skills */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Skills Requiring Attention ({deficitSkills.length})
                </h3>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
                  Actionable Gaps
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                These skills are either missing or below the required industry proficiency level (1-5).
              </p>
              <div className="space-y-3">
                {deficitSkills.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Awesome! You have met or exceeded all target skill requirements for this position.
                  </div>
                ) : (
                  deficitSkills.map((s, idx) => (
                    <div key={idx} className="border border-slate-100 bg-slate-50/50 p-3.5 rounded-xl">
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-800 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-slate-400" />
                          {s.skillName}
                        </span>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          Gap: -{s.gap} Lvl
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Current: <strong className="text-slate-700">{s.studentLevel}/5</strong></span>
                        <span>•</span>
                        <span>Required: <strong className="text-indigo-600">{s.requiredLevel}/5</strong></span>
                        <span>•</span>
                        <span>Weight: <strong className="text-slate-700">{s.weight}x</strong></span>
                        {s.isMandatory && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${(s.studentLevel / s.requiredLevel) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Matched Skills */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Validated Qualifications ({matchedSkills.length})
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                  Criteria Met
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                You meet or surpass the industry baseline proficiency requirements for these skills.
              </p>
              <div className="space-y-3">
                {matchedSkills.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No validated matching skills found yet. Add more skills to your profile.
                  </div>
                ) : (
                  matchedSkills.map((s, idx) => (
                    <div key={idx} className="border border-slate-100 bg-emerald-50/30 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{s.skillName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Proficiency: <span className="font-semibold text-emerald-700">{s.studentLevel}/5</span> (Target: {s.requiredLevel}/5)
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        Ready
                      </span>
                    </div>
                  ))
                )}
              </div>

              {deficitSkills.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    Bridge these gaps with our AI personalized learning roadmap.
                  </div>
                  <Link
                    to="/student/roadmap"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <BookOpen className="w-4 h-4" />
                    Generate Roadmap
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SkillGapView;
