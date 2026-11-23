import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import type { Job } from '../../types/job';
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Building2 
} from 'lucide-react';

export const JobBrowsePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const data = await jobService.getAllActiveJobs();
        setJobs(data);
      } catch (err) {
        console.error('Failed to load jobs', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationFilter ? job.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Opportunity Portal
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Explore Industry Job Openings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Discover opportunities matching your technical skill competencies and career preferences.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or skill (e.g. Java, React, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="sm:w-56 px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching job postings found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or clear your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-700 text-xs flex items-center">
                        <Building2 className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {job.companyName}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {job.location}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-xl font-bold text-slate-900">{job.title}</h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {job.employmentType || 'Full-time'}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-2">{job.description}</p>

                {/* Required Skills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((req) => (
                    <span
                      key={req.id}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700"
                    >
                      {req.skillName} (Lvl {req.minProficiencyLevel}+)
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">
                  Min CGPA: {job.minCgpa || 'N/A'}
                </span>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition cursor-pointer">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
