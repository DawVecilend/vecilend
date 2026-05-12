import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Protegeix les rutes del backoffice:
 * - Si no autenticat → /backoffice (login)
 * - Si autenticat però no és admin → / (pàgina principal)
 * - Si és admin → renderitza el contingut
 */
function AdminProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-app-bg)" }}
      >
        <div className="h-10 w-10 rounded-full border-4 border-[#2A2B31] border-t-[#14B8A6] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/backoffice" replace />;
  }

  if (user.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
