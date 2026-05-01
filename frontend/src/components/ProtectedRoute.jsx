import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg">
        <div
          className="h-10 w-10 rounded-full border-4 border-app-border border-t-vecilend-dark-primary animate-spin"
          role="status"
          aria-label="Cargando"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
