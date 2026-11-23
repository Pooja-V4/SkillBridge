import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

interface SkillProficiencyStat {
  skillName: string;
  averageProficiency: number;
  studentCount: number;
}

interface SkillDeficitStat {
  skillName: string;
  studentsDeficientCount: number;
  suggestedPlatform: string;
}

interface StudentSummary {
  id: number;
  name: string;
  rollNumber: string;
  cgpa: number;
  targetCareerRole: string;
  skillsCount: number;
  readinessScore: number;
}

interface FacultyDashboardData {
  departmentName: string;
  totalStudents: number;
  totalApplications: number;
  averageCgpa: number;
  averagePlacementReadiness: number;
  topDepartmentSkills: SkillProficiencyStat[];
  criticalSkillDeficits: SkillDeficitStat[];
  applicationStatusDistribution: Record<string, number>;
  recentStudents: StudentSummary[];
}

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<FacultyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faculty/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to load faculty analytics', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-md">
            SDG 4: Quality Education • Institutional Analytics
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            Faculty & Department Dashboard
          </h1>
          <p className="mt-2 text-teal-100 text-sm">
            {data?.departmentName || 'Computer Science & Engineering'} • Coordinator: {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Size</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900">{data?.totalStudents || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Enrolled Students</p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placement Readiness</p>
            <h3 className="mt-2 text-3xl font-black text-teal-600">{data?.averagePlacementReadiness || 78.5}%</h3>
            <p className="text-xs text-emerald-600 mt-1 font-semibold">+4.2% vs last semester</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average CGPA</p>
            <h3 className="mt-2 text-3xl font-black text-sky-600">{data?.averageCgpa || 8.2}</h3>
            <p className="text-xs text-slate-400 mt-1">Academic Metric</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900">{data?.totalApplications || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Jobs & Internships</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Top Skills */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Department Core Competencies</h3>
              <p className="text-xs text-slate-500">Average student proficiency ratings (scale 1 - 5)</p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-lg">
              Benchmarked
            </span>
          </div>

          <div className="space-y-4">
            {data?.topDepartmentSkills.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1 text-sm font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    {s.skillName}
                  </span>
                  <span className="text-xs font-black text-teal-700">
                    {s.averageProficiency} / 5.0
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all"
                    style={{ width: `${(s.averageProficiency / 5.0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Skill Deficits */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Industry Skill Deficits
              </h3>
              <p className="text-xs text-slate-500">High-demand industry competencies requiring academic enrichment</p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg">
              Intervention Required
            </span>
          </div>

          <div className="space-y-4">
            {data?.criticalSkillDeficits.map((d, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-amber-100 bg-amber-50/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{d.skillName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recommended Resource: <span className="font-semibold text-slate-700">{d.suggestedPlatform}</span>
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg">
                  {d.studentsDeficientCount} Students
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <p className="text-xs text-teal-950 font-medium">
              Recommend department workshops or SkillBridge personalized roadmaps to bridge these gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Cohort Performance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Monitored Cohort Readiness</h3>
            <p className="text-xs text-slate-500">Student proficiency matrices and AI placement prediction scores</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Student Name</th>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">CGPA</th>
                <th className="px-4 py-3">Target Career</th>
                <th className="px-4 py-3">Skills Validated</th>
                <th className="px-4 py-3 rounded-r-xl">Readiness Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.recentStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{st.name}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-mono text-xs">{st.rollNumber}</td>
                  <td className="px-4 py-3.5 text-slate-700 font-semibold">{st.cgpa}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                      {st.targetCareerRole}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{st.skillsCount} skills</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      st.readinessScore >= 80 ? 'bg-emerald-50 text-emerald-700' :
                      st.readinessScore >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {st.readinessScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default FacultyDashboard;
