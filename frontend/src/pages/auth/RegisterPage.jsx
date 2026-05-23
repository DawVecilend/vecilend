import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import OptimizedImage from "../../components/elementos/OptimizedImage";
import municipalitiesData from "../../data/municipios.json";

import { normalizeString } from "../../utils/string";
import PasswordInput from "../../components/elementos/PasswordInput";
import PasswordRequirements from "../../components/elementos/PasswordRequirements";

function FieldError({ messages }) {
  if (!messages || messages.length === 0) return null;

  return (
    <p className="text-xs text-[var(--color-app-danger)] mt-1 ml-1 font-body">
      {Array.isArray(messages) ? messages[0] : messages}
    </p>
  );
}
function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const [formData, setFormData] = useState({
    username: "",
    nom: "",
    cognoms: "",
    email: "",
    telefon: "",
    direccio: "",
    password: "",
    password_confirmation: "",
    biography: "",
    avatar: null,
    accepta_termes: true,
    ubicacio: {
      lat: 0,
      lng: 0,
    },
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleDireccioChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, direccio: value }));

    if (value.length >= 2) {
      const searchNormalized = normalizeString(value);
      const filtered = municipalitiesData
        .filter((m) => normalizeString(m.name).includes(searchNormalized))
        .slice(0, 8);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (municipality) => {
    setFormData((prev) => ({
      ...prev,
      direccio: municipality.name,
      ubicacio: { lat: municipality.lat, lng: municipality.lng },
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [step]);

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.email.trim()) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/check-user", {
        username: formData.username,
        email: formData.email,
      });

      if (response.data.userExists) {
        setError("Este nombre de usuario ya está en uso.");
      } else if (response.data.emailExists) {
        setError("Este email ya está registrado en el sistema.");
      } else {
        try {
          await api.post("/email/send-code", {
            email: formData.email,
            nom: formData.username,
          });

          setResendCooldown(60);
          setStep(2);
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "No se ha podido enviar el código. Inténtalo de nuevo.",
          );
        }
      }
    } catch (error) {
      console.error("Error backend:", error.response?.data);
      if (error.response?.status === 422 && error.response.data?.errors) {
        setFieldErrors(error.response.data.errors);
        setError("");
      } else {
        setError(
          error.response?.data?.message ||
            "Error al conectar con el servidor. Inténtalo más tarde.",
        );
        setFieldErrors({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    const code = otpDigits.join("");

    if (code.length !== 6) {
      setError("Introduce los 6 dígitos del código.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/email/verify-code", {
        email: formData.email,
        code,
      });

      setOtpVerified(true);
      setTimeout(() => {
        setOtpVerified(false);
        setStep(3);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Código incorrecto o caducado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setError("");

    try {
      await api.post("/email/send-code", {
        email: formData.email,
        nom: formData.username,
      });

      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (err) {
      setError(
        err.response?.data?.message || "No se ha podido reenviar el código.",
      );
    }
  };

  const handleOtpChange = (idx, value) => {
    const v = value.replace(/\D/g, "").slice(-1);

    setOtpDigits((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });

    if (v && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      const prev = document.getElementById(`otp-${idx - 1}`);
      prev?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData?.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpDigits(next);

    // Focus al següent camp buit (o al darrer si està complet)
    const targetIdx = Math.min(pasted.length, 5);
    document.getElementById(`otp-${targetIdx}`)?.focus();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = new FormData();

      data.append("username", formData.username);
      data.append("nom", formData.nom);
      data.append("cognoms", formData.cognoms);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("password_confirmation", formData.password_confirmation);
      data.append("accepta_termes", formData.accepta_termes ? "1" : "0");

      if (formData.biography) data.append("biography", formData.biography);
      if (formData.telefon) data.append("telefon", formData.telefon);
      if (formData.direccio) data.append("direccio", formData.direccio);

      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      if (formData.ubicacio?.lat && formData.ubicacio?.lng) {
        data.append("ubicacio[lat]", formData.ubicacio.lat);
        data.append("ubicacio[lng]", formData.ubicacio.lng);
      }

      await register(data);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError("");
      } else {
        setError(
          err.response?.data?.message ||
            "Error al registrar. Inténtalo de nuevo.",
        );
        setFieldErrors({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-app-bg text-app-text antialiased md:h-[calc(100vh-80px)] md:overflow-hidden flex flex-col dark">
      {step === 1 && (
        <main className="grow flex flex-col md:flex-row md:h-full overflow-hidden">
          <section className="hidden md:flex md:w-1/2 relative bg-app-bg-card items-center justify-center h-full overflow-hidden">
            <div className="absolute inset-0 z-0">
              <OptimizedImage
                alt="Producto compartido entre vecinos"
                className="w-full h-full object-cover opacity-40"
                src="/assets/auth-shared-item.jpg"
              />

              <div className="absolute inset-0 bg-linear-to-tr from-app-bg via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-lg px-8">
              <div className="bg-app-bg-card-secondary/60 backdrop-blur-xl border border-app-border p-8 rounded-xl shadow-2xl">
                <div className="flex gap-1 mb-4 text-vecilend-dark-primary">
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
                  "Vecilend me ha ayudado a encontrar justo lo que necesitaba
                  sin tener que comprarlo. Es fácil de usar, cercano y da mucha
                  confianza saber que los productos están compartidos por
                  vecinos de mi zona."
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-vecilend-dark-primary">
                    <OptimizedImage
                      alt="Avatar de usuario"
                      src="/assets/auth-user-avatar.jpg"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-app-text">Oriol Ferrer</p>
                    <p className="text-sm text-app-text-secondary">
                      Vecino de Barcelona
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col justify-center px-6 md:px-24 bg-app-bg">
            <div className="max-w-md mx-auto w-full -mt-12">
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-app-text tracking-tight mb-2">
                  Crear cuenta
                </h1>

                <p className="text-app-text-secondary text-lg">
                  Únete a Vecilend y empieza a compartir con vecinos de tu zona.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <button className="w-full flex items-center justify-center gap-3 bg-app-bg-card-secondary hover:bg-app-bg-card-secondary border border-app-border py-3 rounded-lg font-medium transition-all active:scale-[0.98]">
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
              </div>

              <div className="relative flex items-center justify-center mb-8">
                <div className="flex-grow border-t border-app-border"></div>

                <span className="mx-4 text-xs font-bold text-app-text-secondary uppercase tracking-widest">
                  O usar cuenta
                </span>

                <div className="flex-grow border-t border-app-border"></div>
              </div>

              <form className="space-y-5" onSubmit={handleContinue}>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-app-text-secondary">
                    Usuario
                  </label>

                  <input
                    name="username"
                    value={formData.username}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldErrors((prev) => ({
                        ...prev,
                        username: undefined,
                      }));
                    }}
                    className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-vecilend-dark-primary focus:border-transparent outline-none transition-all"
                    placeholder="Nombre de usuario"
                    type="text"
                    required
                  />
                  <FieldError messages={fieldErrors.username} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-app-text-secondary">
                    Email
                  </label>

                  <input
                    name="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:ring-2 focus:ring-vecilend-dark-primary focus:border-transparent outline-none transition-all"
                    placeholder="correo@ejemplo.com"
                    type="email"
                    required
                  />
                  <FieldError messages={fieldErrors.email} />
                </div>

                {error && (
                  <div className="bg-[var(--color-app-danger)]/20 border border-[var(--color-app-danger)] text-[var(--color-app-danger)] px-4 py-2 rounded-lg text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <button
                  className={`w-full bg-vecilend-dark-primary text-[var(--color-app-success-on)] font-bold py-4 rounded-lg shadow-lg shadow-vecilend-dark-primary/20 transition-all flex items-center justify-center gap-2 mt-4 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-vecilend-dark-primary active:scale-[0.97]"}`}
                  type="submit"
                  disabled={isLoading}
                >
                  <span>
                    {isLoading ? "Comprobando datos..." : "Continuar"}
                  </span>

                  {!isLoading && (
                    <span className="material-symbols-outlined text-xl">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-app-text-secondary text-sm">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-vecilend-dark-primary font-bold hover:underline"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {step === 2 && (
        <main className="flex-grow flex flex-col items-center justify-center px-4 h-full">
          <div className="w-full max-w-md -mt-12 md:-mt-8">
            <div className="mb-10 md:mb-6">
              <div className="flex justify-between mb-3 px-1">
                <span className="text-xs font-bold tracking-widest text-vecilend-dark-primary uppercase">
                  Paso 2 de 3
                </span>

                <span className="text-xs font-medium text-app-text-secondary">
                  Verificación de email
                </span>
              </div>

              <div className="flex h-1.5 w-full bg-app-bg-card-secondary rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-vecilend-dark-primary/30"></div>
                <div className="h-full w-1/3 bg-vecilend-dark-primary"></div>
                <div className="h-full w-1/3 bg-transparent"></div>
              </div>
            </div>

            <div className="bg-app-bg-card-secondary rounded-xl p-8 border border-app-border shadow-2xl relative">
              <button
                onClick={() => setStep(1)}
                className="absolute top-6 left-6 flex items-center gap-1 text-app-text-secondary hover:text-vecilend-dark-primary transition-colors font-medium text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>

                <span>Volver</span>
              </button>

              <div className="flex flex-col items-center mb-6 mt-2">
                <div className="w-20 h-20 bg-vecilend-dark-primary/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-vecilend-dark-primary/5">
                  <span className="material-symbols-outlined icon-filled text-vecilend-dark-primary text-4xl">
                    mail
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-app-text mb-2 text-center">
                  Revisa tu correo
                </h1>

                <p className="text-app-text-secondary text-center text-sm leading-relaxed">
                  Hemos enviado un código de verificación a{" "}
                  <span className="font-bold text-vecilend-dark-primary">
                    {formData.email}
                  </span>
                  . Introduce el código para confirmar tu cuenta.
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative py-2 flex items-center">
                  <div className="flex-grow border-t border-app-border"></div>

                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-app-text-secondary">
                    Introduce el código
                  </span>

                  <div className="flex-grow border-t border-app-border"></div>
                </div>

                <form className="space-y-4" onSubmit={handleVerifyOTP}>
                  {otpVerified ? (
                    <div className="flex flex-col items-center py-8 animate-fade-in">
                      <span className="material-symbols-outlined text-emerald-400 text-6xl mb-3">
                        check_circle
                      </span>
                      <p className="text-h3-desktop text-emerald-400 font-bold">
                        ¡Código confirmado!
                      </p>
                      <p className="text-app-text-secondary text-label mt-1">
                        Continuamos en un momento…
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between gap-2">
                        {otpDigits.map((digit, i) => (
                          <input
                            key={i}
                            id={`otp-${i}`}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            onPaste={handleOtpPaste}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            className="w-12 h-14 bg-app-bg-card-secondary border-2 border-app-border rounded-lg text-center text-xl font-bold text-vecilend-dark-primary focus:border-vecilend-dark-primary focus:ring-0 outline-none transition-colors"
                            maxLength="1"
                            type="text"
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-vecilend-dark-primary text-[var(--color-app-success-on)] font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-vecilend-dark-primary/10 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-vecilend-dark-primary"}`}
                      >
                        {isLoading ? "Verificando..." : "Verificar código"}
                      </button>

                      {error && (
                        <div className="bg-[var(--color-app-danger)]/20 border border-[var(--color-app-danger)] text-[var(--color-app-danger)] px-4 py-2 rounded-lg text-sm font-medium text-center">
                          {error}
                        </div>
                      )}
                    </>
                  )}
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    className={`text-sm font-medium transition-colors ${resendCooldown > 0 ? "text-app-text-secondary cursor-not-allowed" : "text-vecilend-dark-primary hover:underline"}`}
                  >
                    {resendCooldown > 0
                      ? `Reenviar en ${resendCooldown}s`
                      : "Reenviar código"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {step === 3 && (
        <main className="flex-grow flex flex-col items-center justify-center pt-8 pb-12 px-4 md:pt-10 md:pb-8 h-full overflow-hidden">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch justify-center h-[90%]">
            <div className="w-full md:w-2/3 flex flex-col justify-center h-full relative">
              <div
                id="final-form-card"
                className="w-full max-h-[85vh] bg-app-bg-card-secondary border border-app-border/30 rounded-xl p-6 lg:px-10 lg:py-7 shadow-2xl relative flex flex-col overflow-y-auto custom-scrollbar"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-app-bg-card-secondary">
                  <div className="h-full bg-vecilend-dark-primary w-full shadow-[0_0_10px_rgba(79,219,200,0.5)] transition-all duration-500"></div>
                </div>

                <div className="mb-4 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-bold text-app-text">
                      Últimos datos personales
                    </h1>

                    <span className="text-sm text-vecilend-dark-primary font-semibold px-3 py-1 bg-vecilend-dark-primary/20 rounded-full border border-vecilend-dark-primary/20">
                      Paso 3 de 3
                    </span>
                  </div>

                  <div className="text-app-text-secondary text-sm">
                    <p>
                      Cuéntanos un poco más sobre ti para completar tu perfil.
                    </p>
                    <p>Los campos marcados con asterisco son obligatorios.</p>
                  </div>
                </div>

                <form
                  className="flex flex-col flex-1 px-1"
                  onSubmit={handleRegister}
                >
                  <div className="space-y-4">
                    {error && (
                      <div className="bg-[var(--color-app-danger)]/20 border border-[var(--color-app-danger)] text-[var(--color-app-danger)] px-4 py-1.5 rounded-lg text-xs font-medium text-center">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-app-text-secondary ml-1">
                          Nombre *
                        </label>

                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary group-focus-within:text-vecilend-dark-primary text-lg transition-colors">
                            person
                          </span>

                          <input
                            name="nom"
                            value={formData.nom}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldErrors((prev) => ({
                                ...prev,
                                nom: undefined,
                              }));
                            }}
                            required
                            className="w-full bg-app-bg-card-secondary border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-vecilend-dark-primary text-app-text placeholder:text-app-text-secondary/50 outline-none transition-all text-sm"
                            placeholder="Nombre"
                            type="text"
                          />
                        </div>
                        <FieldError messages={fieldErrors.nom} />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-app-text-secondary ml-1">
                          Apellidos *
                        </label>

                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary group-focus-within:text-vecilend-dark-primary text-lg transition-colors">
                            badge
                          </span>

                          <input
                            name="cognoms"
                            value={formData.cognoms}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldErrors((prev) => ({
                                ...prev,
                                cognoms: undefined,
                              }));
                            }}
                            required
                            className="w-full bg-app-bg-card-secondary border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-vecilend-dark-primary text-app-text placeholder:text-app-text-secondary/50 outline-none transition-all text-sm"
                            placeholder="Apellidos"
                            type="text"
                          />
                        </div>
                        <FieldError messages={fieldErrors.cognoms} />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-app-text-secondary ml-1">
                          Contraseña *
                        </label>

                        <PasswordInput
                          leftIcon="lock"
                          name="password"
                          value={formData.password}
                          onChange={(e) => {
                            handleChange(e);
                            setFieldErrors((prev) => ({
                              ...prev,
                              password: undefined,
                            }));
                          }}
                          required
                          className="w-full bg-app-bg-card-secondary border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-vecilend-dark-primary text-app-text placeholder:text-app-text-secondary/50 outline-none transition-all text-sm"
                          placeholder="••••••••"
                        />
                        <FieldError messages={fieldErrors.password} />
                      </div>

                      <PasswordRequirements password={formData.password} />

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-app-text-secondary ml-1">
                          Confirmar contraseña *
                        </label>

                        <PasswordInput
                          leftIcon="lock_reset"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={(e) => {
                            handleChange(e);
                            setFieldErrors((prev) => ({
                              ...prev,
                              password_confirmation: undefined,
                            }));
                          }}
                          required
                          className="w-full bg-app-bg-card-secondary border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-vecilend-dark-primary text-app-text placeholder:text-app-text-secondary/50 outline-none transition-all text-sm"
                          placeholder="••••••••"
                        />
                        <FieldError
                          messages={fieldErrors.password_confirmation}
                        />
                      </div>

                      {formData.password_confirmation &&
                        formData.password !==
                          formData.password_confirmation && (
                          <p className="text-xs text-[var(--color-app-danger)] mt-1 ml-1 font-body">
                            Las contraseñas no coinciden.
                          </p>
                        )}

                      <div className="space-y-1 relative">
                        <label className="block text-xs font-medium text-app-text-secondary ml-1">
                          Población *
                        </label>

                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary group-focus-within:text-vecilend-dark-primary text-lg transition-colors">
                            location_on
                          </span>

                          <input
                            name="direccio"
                            value={formData.direccio}
                            onChange={(e) => {
                              handleDireccioChange(e);
                              setFieldErrors((prev) => ({
                                ...prev,
                                direccio: undefined,
                              }));
                            }}
                            onFocus={() => {
                              if (suggestions.length > 0)
                                setShowSuggestions(true);
                            }}
                            onBlur={() =>
                              setTimeout(() => setShowSuggestions(false), 200)
                            }
                            className="w-full bg-app-bg-card-secondary border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-vecilend-dark-primary text-app-text placeholder:text-app-text-secondary/50 outline-none transition-all text-sm"
                            placeholder="Ej. Castelldefels"
                            type="text"
                            autoComplete="off"
                            required
                          />

                          {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-50 w-full mt-1 bg-app-bg-card-secondary border border-app-border rounded-lg shadow-2xl max-h-32 overflow-y-auto custom-scrollbar">
                              {suggestions.map((suggestion) => (
                                <li
                                  key={suggestion.id}
                                  onClick={() =>
                                    handleSelectSuggestion(suggestion)
                                  }
                                  className="px-4 py-2 text-xs text-app-text hover:bg-app-bg-card-secondary hover:text-vecilend-dark-primary cursor-pointer transition-colors border-b border-app-border/50 last:border-none"
                                >
                                  <span className="font-medium">
                                    {suggestion.name}
                                  </span>
                                  <span className="text-xs text-app-text-secondary ml-2">
                                    {suggestion.province}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <FieldError messages={fieldErrors.direccio} />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-app-text-secondary ml-1">
                          Teléfono
                        </label>

                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary group-focus-within:text-vecilend-dark-primary text-lg transition-colors">
                            call
                          </span>

                          <input
                            name="telefon"
                            value={formData.telefon}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldErrors((prev) => ({
                                ...prev,
                                telefon: undefined,
                              }));
                            }}
                            className="w-full bg-app-bg-card-secondary border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-vecilend-dark-primary text-app-text placeholder:text-app-text-secondary/50 outline-none transition-all text-sm"
                            placeholder="+34 600 000 000"
                            type="tel"
                          />
                        </div>
                        <FieldError messages={fieldErrors.telefon} />
                      </div>

                      <div className="md:col-span-2 flex items-end">
                        <div className="flex-grow space-y-1">
                          <label className="block text-xs font-medium text-app-text-secondary ml-1">
                            Foto de perfil
                          </label>

                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-app-bg-card-secondary border border-app-border flex items-center justify-center overflow-hidden">
                              {formData.avatar ? (
                                <img
                                  src={URL.createObjectURL(formData.avatar)}
                                  alt="Vista previa del avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="material-symbols-outlined text-app-text-secondary">
                                  account_circle
                                </span>
                              )}
                            </div>

                            <label className="cursor-pointer px-4 py-1.5 text-sm font-medium border border-app-border rounded-lg text-app-text hover:bg-app-bg-card-secondary transition-colors flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">
                                upload
                              </span>
                              Elegir archivo
                              <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-app-text-secondary ml-1">
                        Biografía
                      </label>

                      <textarea
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        className="w-full bg-app-bg-card-secondary border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-inset focus:ring-vecilend-dark-primary text-app-text placeholder:text-app-text-secondary/50 outline-none transition-all resize-none text-sm"
                        placeholder="Cuéntanos algo sobre ti, qué sueles compartir o qué tipo de objetos te interesan..."
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 mt-auto">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 px-6 py-3 rounded-xl border border-app-border text-app-text font-semibold hover:bg-app-bg-card-secondary transition-all active:scale-[0.98] text-sm"
                      type="button"
                    >
                      Volver
                    </button>

                    <button
                      disabled={isLoading}
                      className={`flex-1 px-6 py-3 rounded-xl bg-vecilend-dark-primary text-[var(--color-app-success-on)] font-bold shadow-lg shadow-vecilend-dark-primary/20 transition-all text-sm ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110 active:scale-[0.98]"}`}
                      type="submit"
                    >
                      {isLoading ? "Creando cuenta..." : "Completar registro"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-6 lg:gap-8 justify-center h-full">
              <div className="p-6 bg-app-bg-card rounded-xl border border-app-border/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary mb-4">
                  <span className="material-symbols-outlined">
                    verified_user
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-app-text mb-2">
                    Datos seguros
                  </h3>

                  <p className="text-xs lg:text-sm text-app-text-secondary">
                    Tus datos personales se protegen para que puedas usar
                    Vecilend con confianza.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-app-bg-card rounded-xl border border-app-border/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-app-warning)]/20 flex items-center justify-center text-[var(--color-app-warning)] mb-4">
                  <span className="material-symbols-outlined">palette</span>
                </div>

                <div>
                  <h3 className="font-semibold text-app-text mb-2">
                    Apariencia personalizada
                  </h3>

                  <p className="text-xs lg:text-sm text-app-text-secondary">
                    Podrás elegir entre modo claro u oscuro para adaptar
                    Vecilend a tu preferencia visual.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-app-bg-card rounded-xl border border-app-border/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-vecilend-dark-primary/20/20 flex items-center justify-center text-vecilend-dark-primary mb-4">
                  <span className="material-symbols-outlined">speed</span>
                </div>

                <div>
                  <h3 className="font-semibold text-app-text mb-2">
                    Configuración rápida
                  </h3>

                  <p className="text-xs lg:text-sm text-app-text-secondary">
                    Ya casi está. Después de este paso, tu cuenta estará lista
                    para empezar a usar Vecilend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default RegisterPage;
