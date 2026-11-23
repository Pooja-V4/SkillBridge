import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RoleType } from '../types/auth';

interface ProtectedRouteProps {
  allowedRoles?: RoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If authenticated user tries to access unauthorized role dashboard, redirect to their home
    const roleRoutes: Record<RoleType, string> = {
      STUDENT: '/student/dashboard',
      FACULTY: '/faculty/dashboard',
      RECRUITER: '/recruiter/dashboard',
      ADMIN: '/admin/dashboard',
    };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return <Outlet />;
};
