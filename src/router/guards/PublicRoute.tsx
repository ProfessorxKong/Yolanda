import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
