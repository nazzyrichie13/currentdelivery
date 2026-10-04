import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, admin }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin route but user is not admin
  if (admin && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access
  return children;
}
