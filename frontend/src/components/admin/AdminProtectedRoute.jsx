import { Navigate, Outlet } from "react-router-dom";
import { useBackofficeAuth } from "../../contexts/BackofficeAuthContext";
import ForbiddenPage from "../../pages/main/ForbiddenPage";

function AdminProtectedRoute({ requireRol = null }) {
  const { empleat, loading } = useBackofficeAuth();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-app-bg)" }}
      >
        <div className="h-10 w-10 rounded-full border-4 border-app-border border-t-[#14B8A6] animate-spin" />
      </div>
    );
  }

  if (!empleat) {
    return <Navigate to="/backoffice" replace />;
  }

  if (requireRol && empleat.rol !== requireRol) {
    return <ForbiddenPage backofficeMode />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
