import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBackofficeAuth } from "../../contexts/BackofficeAuthContext";
import PasswordInput from "../../components/elementos/PasswordInput";
import Logo from "../../components/elementos/Logo";

function AdminLoginPage() {
  const { login, empleat, loading } = useBackofficeAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && empleat) {
      navigate("/backoffice/dashboard", { replace: true });
    }
  }, [empleat, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(formData);
      navigate("/backoffice/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) setError("Credenciales incorrectas.");
      else if (err.response?.status === 403) setError(err.response.data?.message || "Cuenta desactivada.");
      else setError("Error de conexión.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg">
      <div className="w-full max-w-md px-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="mb-4"><Logo className="h-10 w-auto" /></Link>
          <h1 className="text-2xl font-bold font-heading text-app-text">Panel de Control</h1>
          <p className="mt-1 text-sm text-app-text-secondary">Acceso restringido al personal autorizado</p>
        </div>

        <div className="rounded-2xl border border-app-border bg-app-bg-card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Email o usuario</label>
              <input
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                required
                placeholder="admin@vecilend.com"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-app-neutral border border-app-border text-app-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Contraseña</label>
              <PasswordInput
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-app-neutral border border-app-border text-app-text"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl py-3 text-sm font-bold bg-app-primary hover:bg-app-primary-hover text-white disabled:opacity-60"
            >
              {submitting ? "Verificando..." : "Entrar al Panel"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--color-app-text-secondary)" }}>
          ¿No eres personal autorizado?{" "}
          <Link to="/" className="text-[#14B8A6] hover:underline transition-colors">
            Volver a la plataforma
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
