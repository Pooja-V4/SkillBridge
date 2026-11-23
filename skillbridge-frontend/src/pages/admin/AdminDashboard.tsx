import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Layers, 
  Activity, 
  Database, 
  Cpu, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface RecentUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface AdminDashboardData {
  totalUsers: number;
  totalStudents: number;
  totalRecruiters: number;
  totalFaculty: number;
  totalJobs: number;
  totalInternships: number;
  totalApplications: number;
  totalSkills: number;
  userRoleDistribution: Record<string, number>;
  applicationTypeDistribution: Record<string, number>;
  recentUsers: RecentUser[];
  systemHealth: {
    databaseStatus: string;
    aiServiceStatus: string;
    springBootVersion: string;
    activeSessions: number;
  };
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to load admin stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-semibold backdrop-blur-md">
            System Administration & Platform Governance
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Admin Console</h1>
          <p className="mt-2 text-slate-300 text-sm">Superuser: {user?.email}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Platform Users</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900">{data?.totalUsers || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">All Roles Combined</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Postings</p>
            <h3 className="mt-2 text-3xl font-black text-emerald-600">
              {(data?.totalJobs || 0) + (data?.totalInternships || 0)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{data?.totalJobs} Jobs • {data?.totalInternships} Internships</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications Processed</p>
            <h3 className="mt-2 text-3xl font-black text-sky-600">{data?.totalApplications || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Throughput</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill Taxonomies</p>
            <h3 className="mt-2 text-3xl font-black text-purple-600">{data?.totalSkills || 24}</h3>
            <p className="text-xs text-slate-400 mt-1">Standardized Matrix</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* System Health Status */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Infrastructure & Service Mesh Health
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Database</div>
              <div className="text-sm font-bold text-slate-800">{data?.systemHealth.databaseStatus}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">AI Microservice</div>
              <div className="text-sm font-bold text-slate-800">{data?.systemHealth.aiServiceStatus}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Backend Engine</div>
              <div className="text-sm font-bold text-slate-800">Spring Boot {data?.systemHealth.springBootVersion}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent User Accounts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Recent User Accounts</h3>
            <p className="text-xs text-slate-500">Platform registration audit log across roles</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{u.fullName}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      u.role === 'STUDENT' ? 'bg-indigo-50 text-indigo-700' :
                      u.role === 'RECRUITER' ? 'bg-emerald-50 text-emerald-700' :
                      u.role === 'FACULTY' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(u.createdAt).toLocaleDateString()}
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
export default AdminDashboard;
