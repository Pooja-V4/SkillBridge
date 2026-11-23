import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { skillService } from '../../services/skillService';
import type { Job } from '../../types/job';
import type { Skill } from '../../types/student';
import { 
  Briefcase, 
  PlusCircle, 
  MapPin, 
  Trash2 
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Post Job Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [salaryMin, setSalaryMin] = useState(600000);
  const [salaryMax, setSalaryMax] = useState(1200000);

  // Selected Skills for the job
  const [selectedSkills, setSelectedSkills] = useState<{
    skillId: number;
    skillName: string;
    minProficiencyLevel: number;
    weight: number;
    isMandatory: boolean;
  }[]>([]);

  const [currentSkillId, setCurrentSkillId] = useState<number | ''>('');
  const [currentProficiency, setCurrentProficiency] = useState(3);
  const [currentWeight, setCurrentWeight] = useState(1.5);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [jobsData, skillsData] = await Promise.all([
        jobService.getMyPostedJobs(),
        skillService.getAllSkills(),
      ]);
      setJobs(jobsData);
      setAvailableSkills(skillsData);
    } catch (err) {
      console.error('Failed to load recruiter data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSkillToJob = () => {
    if (!currentSkillId) return;
    const skillObj = availableSkills.find((s) => s.id === Number(currentSkillId));
    if (!skillObj) return;

    if (selectedSkills.some((s) => s.skillId === skillObj.id)) {
      alert('Skill already added to requirements');
      return;
    }

    setSelectedSkills([
      ...selectedSkills,
      {
        skillId: skillObj.id,
        skillName: skillObj.name,
        minProficiencyLevel: currentProficiency,
        weight: currentWeight,
        isMandatory: true,
      },
    ]);
    setCurrentSkillId('');
  };

  const handleRemoveSkillFromJob = (id: number) => {
    setSelectedSkills(selectedSkills.filter((s) => s.skillId !== id));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      alert('Please specify at least one skill requirement for candidates.');
      return;
    }

    try {
      await jobService.createJob({
        title,
        description,
        location,
        employmentType,
        minCgpa: Number(minCgpa),
        salaryRangeMin: Number(salaryMin),
        salaryRangeMax: Number(salaryMax),
        requiredSkills: selectedSkills.map((s) => ({
          skillId: s.skillId,
          minProficiencyLevel: s.minProficiencyLevel,
          weight: s.weight,
          isMandatory: s.isMandatory,
        })),
      });

      setShowModal(false);
      setTitle('');
      setDescription('');
      setSelectedSkills([]);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to post job');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobService.deleteJob(id);
      await loadData();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md">
            Recruiter & Industry Portal
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            {user?.company || 'Talent Acquisition Team'}
          </h1>
          <p className="mt-2 text-sky-100 text-sm">
            Recruiter: {user?.firstName} {user?.lastName} • {user?.email}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-white text-sky-950 font-bold text-sm shadow hover:bg-sky-50 transition flex items-center cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 mr-2 text-sky-600" />
          Post New Role
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Job Postings</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900">{jobs.length}</h3>
          <p className="mt-4 text-xs text-slate-500">Visible to eligible students</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill Matching Engine</p>
          <h3 className="mt-2 text-3xl font-black text-emerald-600">Active</h3>
          <p className="mt-4 text-xs text-slate-500">TF-IDF & Weighted Gap Analysis</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recruitment Mode</p>
          <h3 className="mt-2 text-3xl font-black text-sky-600">Industry Direct</h3>
          <p className="mt-4 text-xs text-slate-500">SDG 8 & SDG 17 Compliance</p>
        </div>
      </div>

      {/* Job Postings List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Your Posted Opportunities</h3>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active job postings yet</p>
            <p className="text-xs text-slate-500 mt-1">Click "Post New Role" above to publish your requirements.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition bg-slate-50/50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-sky-100 text-sky-800">
                        {job.employmentType || 'Full-time'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {job.location}
                      </span>
                    </div>
                    <h4 className="mt-2 text-xl font-bold text-slate-900">{job.title}</h4>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 max-w-3xl">{job.description}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Skill requirements badges */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 mr-2">Required Competencies:</span>
                  {job.requiredSkills.map((req) => (
                    <span
                      key={req.id}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-800 flex items-center space-x-1"
                    >
                      <span className="font-semibold">{req.skillName}</span>
                      <span className="text-[10px] text-sky-700 bg-sky-50 px-1 rounded">
                        Lvl {req.minProficiencyLevel}+
                      </span>
                      {req.weight > 1.0 && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-bold">
                          Core
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl my-8">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Create Job Posting</h3>

            <form onSubmit={handleCreateJob} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Junior Java Backend Engineer"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bengaluru / Remote"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Min (₹ / yr)</label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Max (₹ / yr)</label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description & Responsibilities</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the project goals, daily duties, team environment, and expectations..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              {/* Required Skills Selection Section */}
              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
                <p className="text-xs font-bold text-sky-950 uppercase tracking-wider">Required Skills & Match Weights</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={currentSkillId}
                    onChange={(e) => setCurrentSkillId(Number(e.target.value))}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:col-span-1"
                  >
                    <option value="">-- Choose Skill --</option>
                    {availableSkills.map((sk) => (
                      <option key={sk.id} value={sk.id}>
                        {sk.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentProficiency}
                    onChange={(e) => setCurrentProficiency(Number(e.target.value))}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  >
                    <option value={1}>Min Lvl 1 (Beginner)</option>
                    <option value={2}>Min Lvl 2 (Basic)</option>
                    <option value={3}>Min Lvl 3 (Intermediate)</option>
                    <option value={4}>Min Lvl 4 (Advanced)</option>
                    <option value={5}>Min Lvl 5 (Expert)</option>
                  </select>

                  <div className="flex gap-2">
                    <select
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs flex-1"
                    >
                      <option value={1.0}>Normal Weight (1.0)</option>
                      <option value={1.5}>Important (1.5)</option>
                      <option value={2.0}>Core/Mandatory (2.0)</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSkillToJob}
                      className="px-3 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Skills Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedSkills.map((s) => (
                    <span
                      key={s.skillId}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-sky-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      <span>{s.skillName} (Lvl {s.minProficiencyLevel}+, w={s.weight})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillFromJob(s.skillId)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow cursor-pointer"
                >
                  Publish Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
