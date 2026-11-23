import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { RoleType } from '../../types/auth';
import { GraduationCap, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<RoleType>('STUDENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Role specifics
  const [rollNumber, setRollNumber] = useState('');
  const [departmentCode, setDepartmentCode] = useState('CSE');
  const [academicYear, setAcademicYear] = useState(3);
  const [cgpa, setCgpa] = useState(8.0);
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
        rollNumber: role === 'STUDENT' ? rollNumber : undefined,
        departmentCode: role === 'STUDENT' ? departmentCode : undefined,
        academicYear: role === 'STUDENT' ? Number(academicYear) : undefined,
        cgpa: role === 'STUDENT' ? Number(cgpa) : undefined,
        companyName: role === 'RECRUITER' ? companyName : undefined,
        designation: role === 'RECRUITER' || role === 'FACULTY' ? designation : undefined,
      });

      if (role === 'STUDENT') navigate('/student/dashboard');
      else if (role === 'FACULTY') navigate('/faculty/dashboard');
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/admin/dashboard');
    } catch (err: any) {
      const fieldErrors = err.response?.data?.fieldErrors;
      if (fieldErrors) {
        setError(Object.values(fieldErrors).join(', '));
      } else {
        setError(err.response?.data?.error || 'Registration failed. Please check your details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
            <GraduationCap className="h-7 w-7" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">SkillBridge</span>
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Create your account</h2>
        <p className="mt-2 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200">
          {/* Role Selection Tabs */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  role === 'STUDENT'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('RECRUITER')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  role === 'RECRUITER'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => setRole('FACULTY')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  role === 'FACULTY'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faculty
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-rose-800">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            {role === 'STUDENT' && (
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-4">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Academic Profile</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Roll / Student ID</label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="21CS101"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="CSE">Computer Science & Eng (CSE)</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="AIDS">AI & Data Science (AIDS)</option>
                      <option value="ECE">Electronics & Communication (ECE)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Current Academic Year</label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Current CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(Number(e.target.value))}
                      placeholder="8.5"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Recruiter Specific Fields */}
            {role === 'RECRUITER' && (
              <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 space-y-4">
                <p className="text-xs font-bold text-sky-900 uppercase tracking-wide">Company & Designation</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google, Infosys, TechCorp"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Job Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Talent Acquisition Lead"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Faculty Specific Fields */}
            {role === 'FACULTY' && (
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 space-y-4">
                <p className="text-xs font-bold text-teal-900 uppercase tracking-wide">Faculty Designation</p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Associate Professor / Placement In-charge"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : `Register as ${role}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
