import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PasswordInput from "../components/elementos/PasswordInput";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) setError("Credenciales incorrectas");
      else if (err.response?.status === 403)
        setError(err.response.data.message || "Acceso denegado");
      else if (err.response?.status === 422)
        setError(Object.values(err.response.data.errors).flat()[0]);
      else setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-app-bg text-app-text antialiased md:h-[calc(100vh-80px)] md:overflow-hidden flex flex-col dark">
      <main className="grow flex flex-col md:flex-row md:h-full overflow-hidden">
        <section className="hidden md:flex md:w-1/2 relative bg-[#090f0e] items-center justify-center h-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Professional Gear"
              className="w-full h-full object-cover opacity-40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQW8YXGcPQGsj1Q0KeE6EM5PNeIb_2pLMJDvddODr88dUMeNgFpr5Qs5dEO2AB3ny82vvXhxKR1aN2E7BqjU2sV5FtcQZ-345ynN76RDdZv2smlnejUHG2dyJnTy2VyYGx6-IWF-CKxfbXp8pzNllfgIcWjEMqPvNwxWyDXubGsjAiiVqX-uFuvxCluOPaesKLrAtqv5nHmjRfKM-WAQLXtTiquVhbmhJZ62YM7sq7EbMBlR3I8WQF1s_63H87bU9H2tZ7BGot5ARl"
            />
            <div className="absolute inset-0 bg-linear-to-tr from-[#0e1513] via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-lg px-8">
            <div className="bg-[#1a211f]/60 backdrop-blur-xl border border-app-border p-8 rounded-xl shadow-2xl">
              <div className="flex gap-1 mb-4 text-[#4fdbc8]">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined icon-filled"
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-xl font-medium leading-relaxed italic text-app-text mb-6">
                “Vecilend me ha ayudado a encontrar justo lo que necesitaba sin
                tener que comprarlo. Es fácil de usar, cercano y da mucha
                confianza saber que los productos están compartidos por vecinos
                de mi zona.”
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4fdbc8]">
                  <img
                    alt="User Avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3lCex78R9gss1rSRXiBMONf6Kpo-aObjVvhOsdxYfDEV5VkAjs6H5udYWFVTbBQLLe-5OX-1Nfr__L2EXX8_85qkavwodEygWuVjZ6R_S-ujoopRTJ6XdUyiVw_F4VHAySzA5WVdjgh6exDBGT_RwCUnYkkCZZYY6CTNyMrYDouOrmBTLw1SX27Er49FLqX-_HboWJrblOlE2XV8QqCIM-hFlX3WtzUVzAQ7DIjz6roiYJcCohYGKap5Asn5a0VIiVco4tNU-khmT"
                  />
                </div>
                <div>
                  <p className="font-bold text-app-text">Laura Martínez</p>
                  <p className="text-sm text-[#859490]">Vecina de Barcelona</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LADO DERECHO: FORMULARIO */}
        <section className="flex-1 flex flex-col justify-center px-6 md:px-24 bg-app-bg">
          <div className="max-w-md mx-auto w-full -mt-12">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-app-text tracking-tight mb-2">
                Bienvenido/a
              </h1>
              <p className="text-[#859490] text-lg">
                Inicia sesión para acceder a tu comunidad.
              </p>
            </div>

            {/* Botones Sociales Estilo RegisterPage */}
            <div className="flex flex-col gap-3 mb-6">
              <button className="w-full flex items-center justify-center gap-3 bg-[#1a211f] hover:bg-[#252b2a] border border-app-border py-3 rounded-lg font-medium transition-all active:scale-[0.98]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span>Continuar con Google</span>
              </button>
              <button className="w-full flex items-center justify-center gap-3 bg-[#1a211f] hover:bg-[#252b2a] border border-app-border py-3 rounded-lg font-medium transition-all active:scale-[0.98]">
                <svg className="w-5 h-5 fill-[#dde4e1]" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.002-.156-3.725 1.09-4.51 1.09zM15.53 4.854c.87-1.05 1.454-2.506 1.293-3.96-1.247.052-2.76.831-3.656 1.883-.792.935-1.48 2.442-1.293 3.869 1.39.104 2.786-.74 3.656-1.792z"></path>
                </svg>
                <span>Continuar con Apple</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-8">
              <div className="flex-grow border-t border-app-border"></div>
              <span className="mx-4 text-xs font-bold text-[#859490] uppercase tracking-widest">
                O iniciar con
              </span>
              <div className="flex-grow border-t border-app-border"></div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-app-text-secondary">
                  Usuario / Email
                </label>
                <input
                  value={formData.login}
                  onChange={(e) =>
                    setFormData({ ...formData, login: e.target.value })
                  }
                  className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all"
                  placeholder="Nombre de usuario o email"
                  type="text"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-app-text-secondary">
                    Contraseña
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-[#4fdbc8] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <PasswordInput
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-2 rounded-lg text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <button
                className={`w-full bg-[#4fdbc8] text-[#003731] font-bold py-4 rounded-lg shadow-lg shadow-[#4fdbc8]/20 transition-all flex items-center justify-center gap-2 mt-4 ${submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#14b8a6] active:scale-[0.97]"}`}
                type="submit"
                disabled={submitting}
              >
                <span>
                  {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </span>
                {!submitting && (
                  <span className="material-symbols-outlined text-xl">
                    login
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#859490] text-sm">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-[#4fdbc8] font-bold hover:underline"
                >
                  Crea una aquí
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
