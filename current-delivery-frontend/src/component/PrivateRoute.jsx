import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, admin }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // No token → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin route but user is not admin → go to login
  if (admin && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Admin verified → go to admin dashboard
  if (admin && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Normal protected route
  return children;
}
