import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sparkles, TrendingUp, CheckCircle2, Award, RefreshCw, AlertCircle } from 'lucide-react';

interface CareerProbability {
  role: string;
  probability: number;
  percentage: number;
}

interface CareerPredictionResult {
  predictedRole: string;
  confidence: number;
  confidencePercentage: number;
  topRecommendations: CareerProbability[];
  modelVersion: string;
}

export const CareerPredictorView: React.FC = () => {
  const [prediction, setPrediction] = useState<CareerPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/ai/career-prediction');
      setPrediction(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate career prediction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Random Forest Multi-Class Classifier
            </div>
            <h2 className="text-2xl font-black">AI Career Path Recommendation</h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-xl">
              Trained on student skill matrices, verified coursework, CGPA, and project depth to predict your optimal industry specialization with statistical confidence.
            </p>
          </div>
          <button
            onClick={fetchPrediction}
            disabled={loading}
            className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Evaluating Model...' : 'Re-Evaluate Profile'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Prediction Card */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Primary Fit
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-4">{prediction.predictedRole}</h3>
              <p className="text-xs text-slate-500 mt-1">Based on current technical competencies and verified experience.</p>

              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="text-4xl font-black text-emerald-600">
                  {Math.round(prediction.confidencePercentage)}%
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Model Confidence
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${prediction.confidencePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Engine: {prediction.modelVersion}</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Validated
              </span>
            </div>
          </div>

          {/* Probability Rankings Distribution */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Career Path Probability Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Relative probability scores across benchmarked technical domains
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg">
                Top 5 Paths
              </span>
            </div>

            <div className="space-y-4 mt-6">
              {(prediction.topRecommendations || []).map((rec, index) => (
                <div key={index} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{rec.role}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{rec.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-emerald-500' : 'bg-indigo-400'
                      }`}
                      style={{ width: `${Math.max(rec.percentage, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs text-indigo-950 font-medium">
                  Want to enhance your probability for another role? Check your skill gaps and follow our personalized roadmaps.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CareerPredictorView;
