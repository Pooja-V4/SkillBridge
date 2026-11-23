import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import type { Application, ApplicationStatus } from '../../types/application';
import { Users } from 'lucide-react';

export const RecruiterApplicantsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationService.getRecruiterApplications();
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

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await applicationService.updateStatus(selectedApp.id, {
        status: newStatus,
        recruiterFeedback: feedback,
      });
      alert('Application status updated successfully!');
      setSelectedApp(null);
      setFeedback('');
      await loadApplications();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
          Applicant Tracking System (ATS)
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Manage Candidate Applications</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review candidate academic profiles, weighted skill match percentages, and advance students through interview stages.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No applicants yet</h3>
          <p className="text-xs text-slate-500 mt-1">Applications submitted for your job or internship postings will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Target Role</th>
                <th className="px-6 py-4">Skill Match</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{app.studentName}</p>
                    <p className="text-xs text-slate-500">{app.departmentName} • CGPA: {app.studentCgpa}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{app.targetTitle}</p>
                    <span className="text-[10px] font-bold uppercase text-slate-500">{app.type}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-indigo-600 text-base">
                    {app.skillMatchPercentage}%
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setNewStatus(app.status);
                        setFeedback(app.recruiterFeedback || '');
                      }}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Review & Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">{selectedApp.studentName}</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedApp.targetTitle} ({selectedApp.type})</p>

            {selectedApp.coverLetter && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-bold text-slate-600 uppercase">Cover Letter / SOP</p>
                <p className="text-xs text-slate-700 mt-1">{selectedApp.coverLetter}</p>
              </div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="SELECTED">Selected / Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recruiter Feedback / Next Steps</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g. Technical interview scheduled for Monday at 11 AM IST..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl cursor-pointer"
                >
                  Update Candidate Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
