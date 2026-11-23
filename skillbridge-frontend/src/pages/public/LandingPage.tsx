import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BrainCircuit, 
  Building2, 
  School, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-indigo-50/70 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-6">
              <BrainCircuit className="h-4 w-4" />
              <span>AI-Powered Academia–Industry Collaboration Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Bridge the Gap Between <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500 bg-clip-text text-transparent">Campus Knowledge</span> & Industry Demand
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              SkillBridge analyzes real-time industry job roles, evaluates student skill profiles, identifies competency gaps, and delivers personalized roadmaps and matched internships.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition"
              >
                Join SkillBridge
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">How SkillBridge Operates</h2>
            <p className="mt-3 text-slate-600">A multi-stakeholder ecosystem connecting students, recruiters, and educational institutions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Students</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Evaluate your technical and soft skills against target roles, identify missing competencies with weighted gap scoring, and get matched to jobs and internships.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Weighted Skill Gap Analysis</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Random Forest Career Prediction</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Personalized Learning Roadmaps</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Recruiters</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Post full-time jobs and internships with specific skill and proficiency requirements. Let TF-IDF & Cosine Similarity match top-ranked talent effortlessly.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Weighted Skill-Based Matching</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Candidate Pipeline Management</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Verified Technical Competencies</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-6">
                <School className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Faculty</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Monitor departmental skill progress, identify macro-level curriculum gaps against industry trends, and track student placement readiness.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Department Skill Distribution</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Common Gap Diagnostics</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Placement Readiness Analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Development Goals Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-xs font-semibold">UN Sustainable Goals</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Contributing to Global Educational & Economic Standards</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <span className="text-rose-400 font-extrabold text-lg">SDG 4: Quality Education</span>
              <p className="text-xs text-slate-400 mt-1 mb-3">Target 4.4</p>
              <p className="text-sm text-slate-300">
                Substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment and entrepreneurship.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <span className="text-amber-400 font-extrabold text-lg">SDG 8: Decent Work</span>
              <p className="text-xs text-slate-400 mt-1 mb-3">Target 8.5</p>
              <p className="text-sm text-slate-300">
                Promote full and productive employment and decent work for all young people and equal pay for work of equal value through merit-based skill matching.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <span className="text-sky-400 font-extrabold text-lg">SDG 17: Partnerships</span>
              <p className="text-xs text-slate-400 mt-1 mb-3">Target 17.16</p>
              <p className="text-sm text-slate-300">
                Enhance multi-stakeholder partnerships between universities and the corporate sector to mobilize knowledge, technology, and internships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-950 text-slate-400 text-xs text-center border-t border-slate-800">
        <p>&copy; 2026 SkillBridge Platform. Final Year CSE Capstone & Research Initiative.</p>
      </footer>
    </div>
  );
};
