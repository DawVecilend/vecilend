import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import municipalitiesData from "../data/municipios.json";

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);

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
    radi_proximitat: 10,
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

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleDireccioChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, direccio: value }));

    if (value.length >= 2) {
      const searchNormalized = normalizeString(value);
      const filtered = municipalitiesData.data
        .map((row) => row[9])
        .filter((name) => normalizeString(name).includes(searchNormalized))
        .slice(0, 8);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (municipality) => {
    setFormData((prev) => ({ ...prev, direccio: municipality }));
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
        // Enviar código de verificación
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
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error al conectar con el servidor. Inténtalo más tarde.");
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
      setStep(3);
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
      setError(
        err.response?.data?.message ||
          "Error al registrar. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased md:h-[calc(100vh-80px)] md:overflow-hidden flex flex-col dark">
      {step === 1 && (
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
              <div className="bg-[#1a211f]/60 backdrop-blur-xl border border-[#3c4947] p-8 rounded-xl shadow-2xl">
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
                <p className="text-xl font-medium leading-relaxed italic text-[#dde4e1] mb-6">
                  "The quality of the equipment and the seamless professional
                  workflow completely transformed how we handle our high-stakes
                  productions."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4fdbc8]">
                    <img
                      alt="User Avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3lCex78R9gss1rSRXiBMONf6Kpo-aObjVvhOsdxYfDEV5VkAjs6H5udYWFVTbBQLLe-5OX-1Nfr__L2EXX8_85qkavwodEygWuVjZ6R_S-ujoopRTJ6XdUyiVw_F4VHAySzA5WVdjgh6exDBGT_RwCUnYkkCZZYY6CTNyMrYDouOrmBTLw1SX27Er49FLqX-_HboWJrblOlE2XV8QqCIM-hFlX3WtzUVzAQ7DIjz6roiYJcCohYGKap5Asn5a0VIiVco4tNU-khmT"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#dde4e1]">Alex Chen</p>
                    <p className="text-sm text-[#859490]">
                      Creative Director, Lumina Studios
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col justify-center px-6 md:px-24 bg-[#0e1513]">
            <div className="max-w-md mx-auto w-full -mt-12">
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-[#dde4e1] tracking-tight mb-2">
                  Crear cuenta
                </h1>
                <p className="text-[#859490] text-lg">
                  Únete a la comunidad de profesionales de élite hoy.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <button className="w-full flex items-center justify-center gap-3 bg-[#1a211f] hover:bg-[#252b2a] border border-[#3c4947] py-3 rounded-lg font-medium transition-all active:scale-[0.98]">
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
                <button className="w-full flex items-center justify-center gap-3 bg-[#1a211f] hover:bg-[#252b2a] border border-[#3c4947] py-3 rounded-lg font-medium transition-all active:scale-[0.98]">
                  <svg className="w-5 h-5 fill-[#dde4e1]" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.002-.156-3.725 1.09-4.51 1.09zM15.53 4.854c.87-1.05 1.454-2.506 1.293-3.96-1.247.052-2.76.831-3.656 1.883-.792.935-1.48 2.442-1.293 3.869 1.39.104 2.786-.74 3.656-1.792z"></path>
                  </svg>
                  <span>Continuar con Apple</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center mb-8">
                <div className="flex-grow border-t border-[#3c4947]"></div>
                <span className="mx-4 text-xs font-bold text-[#859490] uppercase tracking-widest">
                  O usar cuenta
                </span>
                <div className="flex-grow border-t border-[#3c4947]"></div>
              </div>

              <form className="space-y-5" onSubmit={handleContinue}>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#bbcac6]">
                    Usuario
                  </label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all"
                    placeholder="Nombre de usuario"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#bbcac6]">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all"
                    placeholder="correo@ejemplo.com"
                    type="email"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-2 rounded-lg text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <button
                  className={`w-full bg-[#4fdbc8] text-[#003731] font-bold py-4 rounded-lg shadow-lg shadow-[#4fdbc8]/20 transition-all flex items-center justify-center gap-2 mt-4 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#14b8a6] active:scale-[0.97]"}`}
                  type="submit"
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Comprobando datos..." : "Continue"}</span>
                  {!isLoading && (
                    <span className="material-symbols-outlined text-xl">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-[#859490] text-sm">
                  ¿Tienes cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-[#4fdbc8] font-bold hover:underline"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Steps 2 and 3 remain exactly as defined in previous messages */}
      {step === 2 && (
        <main className="flex-grow flex flex-col items-center justify-center px-4 h-full">
          <div className="w-full max-w-md -mt-12 md:-mt-8">
            <div className="mb-10 md:mb-6">
              <div className="flex justify-between mb-3 px-1">
                <span className="text-xs font-bold tracking-widest text-[#4fdbc8] uppercase">
                  Step 2 of 3
                </span>
                <span className="text-xs font-medium text-[#859490]">
                  Email Verification
                </span>
              </div>
              <div className="flex h-1.5 w-full bg-[#1a211f] rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#4fdbc8]/30"></div>
                <div className="h-full w-1/3 bg-[#4fdbc8]"></div>
                <div className="h-full w-1/3 bg-transparent"></div>
              </div>
            </div>

            <div className="bg-[#1a211f] rounded-xl p-8 border border-[#3c4947] shadow-2xl relative">
              <button
                onClick={() => setStep(1)}
                className="absolute top-6 left-6 flex items-center gap-1 text-[#859490] hover:text-[#4fdbc8] transition-colors font-medium text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
                <span>Back</span>
              </button>

              <div className="flex flex-col items-center mb-6 mt-2">
                <div className="w-20 h-20 bg-[#14b8a6]/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-[#14b8a6]/5">
                  <span className="material-symbols-outlined icon-filled text-[#4fdbc8] text-4xl">
                    mail
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-[#dde4e1] mb-2 text-center">
                  Check your inbox!
                </h1>
                <p className="text-[#bbcac6] text-center text-sm leading-relaxed">
                  We've sent a verification link to{" "}
                  <span className="font-bold text-[#4fdbc8]">
                    {formData.email}
                  </span>
                  . Click the link in the message to confirm your account.
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative py-2 flex items-center">
                  <div className="flex-grow border-t border-[#3c4947]"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#859490]">
                    OR ENTER CODE
                  </span>
                  <div className="flex-grow border-t border-[#3c4947]"></div>
                </div>

                <form className="space-y-4" onSubmit={handleVerifyOTP}>
                  <div className="flex justify-between gap-2">
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors"
                        maxLength="1"
                        type="text"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-[#4fdbc8] text-[#003731] font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-[#4fdbc8]/10 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#14b8a6]"}`}
                  >
                    {isLoading ? "Verificando..." : "Verify Code"}
                  </button>

                  {error && (
                    <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-2 rounded-lg text-sm font-medium text-center">
                      {error}
                    </div>
                  )}
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    className={`text-sm font-medium transition-colors ${resendCooldown > 0 ? "text-[#859490] cursor-not-allowed" : "text-[#4fdbc8] hover:underline"}`}
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
                className="w-full h-full bg-[#1a211f] border border-[#3c4947]/30 rounded-xl p-6 lg:px-10 lg:py-7 shadow-2xl relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2f3634]">
                  <div className="h-full bg-[#4fdbc8] w-full shadow-[0_0_10px_rgba(79,219,200,0.5)] transition-all duration-500"></div>
                </div>

                <div className="mb-4 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-bold text-[#dde4e1]">
                      Final Personal Details
                    </h1>
                    <span className="text-sm text-[#4fdbc8] font-semibold px-3 py-1 bg-[#14b8a6]/20 rounded-full border border-[#4fdbc8]/20">
                      Step 3 of 3
                    </span>
                  </div>
                  <p className="text-[#859490] text-sm">
                    Tell us a bit more about yourself to finalize your profile.
                  </p>
                </div>

                <form
                  className="flex flex-col flex-1 px-1"
                  onSubmit={handleRegister}
                >
                  <div className="space-y-4">
                    {error && (
                      <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-1.5 rounded-lg text-xs font-medium text-center">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                          First Name (Nom) *
                        </label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">
                            person
                          </span>
                          <input
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm"
                            placeholder="John"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                          Last Name (Cognoms) *
                        </label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">
                            badge
                          </span>
                          <input
                            name="cognoms"
                            value={formData.cognoms}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm"
                            placeholder="Doe"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                          Password *
                        </label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">
                            lock
                          </span>
                          <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm"
                            placeholder="••••••••"
                            type="password"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                          Confirm Password *
                        </label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">
                            lock_reset
                          </span>
                          <input
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm"
                            placeholder="••••••••"
                            type="password"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 relative">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                          City/State (Población)
                        </label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">
                            location_on
                          </span>
                          <input
                            name="direccio"
                            value={formData.direccio}
                            onChange={handleDireccioChange}
                            onFocus={() => {
                              if (suggestions.length > 0)
                                setShowSuggestions(true);
                            }}
                            onBlur={() =>
                              setTimeout(() => setShowSuggestions(false), 200)
                            }
                            className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm"
                            placeholder="Ej. Castelldefels"
                            type="text"
                            autoComplete="off"
                            required
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-50 w-full mt-1 bg-[#1a211f] border border-[#3c4947] rounded-lg shadow-2xl max-h-32 overflow-y-auto custom-scrollbar">
                              {suggestions.map((suggestion, index) => (
                                <li
                                  key={index}
                                  onMouseDown={() =>
                                    handleSelectSuggestion(suggestion)
                                  }
                                  className="px-4 py-2 text-xs text-[#dde4e1] hover:bg-[#2f3634] hover:text-[#4fdbc8] cursor-pointer transition-colors border-b border-[#3c4947]/50 last:border-none"
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                          Phone Number
                        </label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">
                            call
                          </span>
                          <input
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleChange}
                            className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm"
                            placeholder="+34 600 000 000"
                            type="tel"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 flex items-end">
                        <div className="flex-grow space-y-1">
                          <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                            Profile Picture (Optional)
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#2f3634] border border-[#3c4947] flex items-center justify-center overflow-hidden">
                              {formData.avatar ? (
                                <img
                                  src={URL.createObjectURL(formData.avatar)}
                                  alt="Avatar Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="material-symbols-outlined text-[#859490]">
                                  account_circle
                                </span>
                              )}
                            </div>
                            <label className="cursor-pointer px-4 py-1.5 text-sm font-medium border border-[#859490] rounded-lg text-[#dde4e1] hover:bg-[#2f3634] transition-colors flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">
                                upload
                              </span>{" "}
                              Choose File
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
                      <label className="block text-xs font-medium text-[#bbcac6] ml-1">
                        Professional Bio
                      </label>
                      <textarea
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        className="w-full bg-[#2f3634] border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all resize-none text-sm"
                        placeholder="Describe your experience..."
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 mt-auto">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 px-6 py-3 rounded-xl border border-[#3c4947] text-[#dde4e1] font-semibold hover:bg-[#2f3634] transition-all active:scale-[0.98] text-sm"
                      type="button"
                    >
                      Back
                    </button>
                    <button
                      disabled={isLoading}
                      className={`flex-1 px-6 py-3 rounded-xl bg-[#4fdbc8] text-[#003731] font-bold shadow-lg shadow-[#4fdbc8]/20 transition-all text-sm ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110 active:scale-[0.98]"}`}
                      type="submit"
                    >
                      Complete Registration
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* CONTENEDORES DE LA DERECHA: ORIGINALES E INTACTOS */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 lg:gap-8 justify-center h-full">
              <div className="p-6 bg-[#161d1b] rounded-xl border border-[#3c4947]/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center text-[#4fdbc8] mb-4">
                  <span className="material-symbols-outlined">
                    verified_user
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#dde4e1] mb-2">
                    Secure Storage
                  </h3>
                  <p className="text-xs lg:text-sm text-[#859490]">
                    Your personal data is encrypted and stored according to
                    strict security protocols.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#161d1b] rounded-xl border border-[#3c4947]/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-[#f38764]/20 flex items-center justify-center text-[#ffb59e] mb-4">
                  <span className="material-symbols-outlined">
                    visibility_off
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#dde4e1] mb-2">
                    Privacy Control
                  </h3>
                  <p className="text-xs lg:text-sm text-[#859490]">
                    Control what information is visible to other members in your
                    settings later.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#161d1b] rounded-xl border border-[#3c4947]/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-[#b9e9e0]/20 flex items-center justify-center text-[#a0d0c6] mb-4">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#dde4e1] mb-2">
                    Quick Setup
                  </h3>
                  <p className="text-xs lg:text-sm text-[#859490]">
                    Almost there! After this step, your account will be live and
                    ready for use.
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
