import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import type { Application, ApplicationStatus } from '../../types/application';
import { 
  Clock, 
  Building2 
} from 'lucide-react';

export const ApplicationTrackerPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Applied</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">Under Review</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Shortlisted 🎉</span>;
      case 'INTERVIEW_SCHEDULED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Interview Scheduled</span>;
      case 'SELECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 font-extrabold">Selected / Offer Made 🏆</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Application Closed</span>;
      default:
        return null;
    }
  };

  const filtered = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Candidate Pipeline
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Application Tracker</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track the recruitment pipeline status, interview milestones, and weighted skill-match scores of your submitted opportunities.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {['ALL', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No applications found</h3>
          <p className="text-xs text-slate-500 mt-1">Explore Job or Internship portals to submit your profile.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-300 transition"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {app.type}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600 flex items-center">
                    <Building2 className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {app.companyName}
                  </span>
                </div>
                <h3 className="mt-1.5 text-xl font-bold text-slate-900">{app.targetTitle}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                {app.recruiterFeedback && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold">Recruiter Feedback: </span>
                    {app.recruiterFeedback}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-left sm:text-right">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Skill Match</p>
                  <p className="text-xl font-black text-indigo-600">{app.skillMatchPercentage}%</p>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
