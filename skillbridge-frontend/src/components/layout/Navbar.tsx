import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'STUDENT': return '/student/dashboard';
      case 'FACULTY': return '/faculty/dashboard';
      case 'RECRUITER': return '/recruiter/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-100 group-hover:bg-indigo-700 transition">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
                SkillBridge
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardLink()}
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-medium text-slate-800 leading-tight">{user.firstName} {user.lastName}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-indigo-100 text-indigo-800">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
