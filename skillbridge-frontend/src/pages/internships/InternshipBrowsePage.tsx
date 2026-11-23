import React, { useState, useEffect } from 'react';
import { internshipService, applicationService } from '../../services/applicationService';
import type { Internship } from '../../types/application';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Search, 
  DollarSign, 
  Send 
} from 'lucide-react';

export const InternshipBrowsePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Apply modal
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const loadInternships = async () => {
    try {
      setIsLoading(true);
      const data = await internshipService.getAllActiveInternships();
      setInternships(data);
    } catch (err) {
      console.error('Failed to load internships', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;

    try {
      setIsApplying(true);
      await applicationService.submitApplication({
        type: 'INTERNSHIP',
        internshipId: selectedInternship.id,
        coverLetter,
      });
      alert('Application submitted successfully! Your weighted skill-match has been recorded.');
      setSelectedInternship(null);
      setCoverLetter('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const filtered = internships.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requiredSkills.some((s) => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLoc = locationFilter ? item.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    return matchesSearch && matchesLoc;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
          Internship Portal (SDG 8.5)
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Industry Internship Openings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Gain hands-on corporate engineering experience with verified corporate partners.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role, company, or required skill (e.g. React, Spring Boot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <input
          type="text"
          placeholder="Filter location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="sm:w-56 px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching internship postings</h3>
          <p className="text-xs text-slate-500 mt-1">Check back later or adjust your search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((intern) => (
            <div
              key={intern.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-700 text-xs flex items-center">
                      <Building2 className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {intern.companyName}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">{intern.title}</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800">
                    {intern.durationMonths} Months
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 line-clamp-2">{intern.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {intern.location}
                  </span>
                  <span className="flex items-center text-emerald-700 font-semibold">
                    <DollarSign className="h-3.5 w-3.5 mr-0.5 text-emerald-600" />
                    ₹{intern.stipendMonthly?.toLocaleString()}/mo
                  </span>
                </div>

                {/* Required Skills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {intern.requiredSkills.map((req) => (
                    <span
                      key={req.id}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700"
                    >
                      {req.skillName} (Lvl {req.minProficiencyLevel}+)
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">
                  Min CGPA: {intern.minCgpa || 'N/A'}
                </span>
                {isAuthenticated && user?.role === 'STUDENT' ? (
                  <button
                    onClick={() => setSelectedInternship(intern)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition cursor-pointer flex items-center"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Apply Now
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-semibold">Login as Student to Apply</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Apply to {selectedInternship.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedInternship.companyName}</p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Statement of Purpose / Cover Letter
                </label>
                <textarea
                  required
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Highlight your proficiency in the required skills and why you're a great fit..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInternship(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
