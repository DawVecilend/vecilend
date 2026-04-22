import React, { useState, useEffect, useContext } from 'react';
import HeaderDesktop from '../components/layouts/header/HeaderDesktop';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import municipalitiesData from '../data/municipios.json';

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        lng: 0
    }
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const handleDireccioChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, direccio: value }));

    if (value.length >= 2) {
      const searchNormalized = normalizeString(value);
      const filtered = municipalitiesData.data
        .map(row => row[9]) 
        .filter(name => normalizeString(name).includes(searchNormalized))
        .slice(0, 8); 
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (municipality) => {
    setFormData(prev => ({ ...prev, direccio: municipality }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [step]);

  const handleContinue = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username.trim() || !formData.email.trim()) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/check-user", {
        username: formData.username,
        email: formData.email
      });

      if (response.data.userExists) {
        setError('Este nombre de usuario ya está en uso.');
      } else if (response.data.emailExists) {
        setError('Este email ya está registrado en el sistema.');
      } else {
        setStep(2);
      }
      
    } catch (error) {
      console.error("Error backend:", error.response?.data);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al conectar con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setStep(3);
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('nom', formData.nom);
      data.append('cognoms', formData.cognoms);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('password_confirmation', formData.password_confirmation);
      data.append('accepta_termes', formData.accepta_termes ? '1' : '0');

      if (formData.biography) data.append('biography', formData.biography);
      if (formData.telefon) data.append('telefon', formData.telefon);
      if (formData.direccio) data.append('direccio', formData.direccio);

      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }

      if (formData.ubicacio?.lat && formData.ubicacio?.lng) {
        data.append('ubicacio[lat]', formData.ubicacio.lat);
        data.append('ubicacio[lng]', formData.ubicacio.lng);
      }

      await register(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    };
  }

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased md:h-[calc(100vh-80px)] md:overflow-hidden flex flex-col dark">
      <HeaderDesktop />

      {step === 1 && (
        <main className="flex-grow flex flex-col md:flex-row md:h-full overflow-hidden">
          <section className="hidden md:flex md:w-1/2 relative bg-[#090f0e] items-center justify-center h-full overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="Professional Gear" className="w-full h-full object-cover opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQW8YXGcPQGsj1Q0KeE6EM5PNeIb_2pLMJDvddODr88dUMeNgFpr5Qs5dEO2AB3ny82vvXhxKR1aN2E7BqjU2sV5FtcQZ-345ynN76RDdZv2smlnejUHG2dyJnTy2VyYGx6-IWF-CKxfbXp8pzNllfgIcWjEMqPvNwxWyDXubGsjAiiVqX-uFuvxCluOPaesKLrAtqv5nHmjRfKM-WAQLXtTiquVhbmhJZ62YM7sq7EbMBlR3I8WQF1s_63H87bU9H2tZ7BGot5ARl" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0e1513] via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-lg px-8">
              <div className="bg-[#1a211f]/60 backdrop-blur-xl border border-[#3c4947] p-8 rounded-xl shadow-2xl">
                <div className="flex gap-1 mb-4 text-[#4fdbc8]">
                  {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined icon-filled">star</span>)}
                </div>
                <p className="text-xl font-medium leading-relaxed italic text-[#dde4e1] mb-6">
                  "The quality of the equipment and the seamless professional workflow completely transformed how we handle our high-stakes productions."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4fdbc8]">
                    <img alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3lCex78R9gss1rSRXiBMONf6Kpo-aObjVvhOsdxYfDEV5VkAjs6H5udYWFVTbBQLLe-5OX-1Nfr__L2EXX8_85qkavwodEygWuVjZ6R_S-ujoopRTJ6XdUyiVw_F4VHAySzA5WVdjgh6exDBGT_RwCUnYkkCZZYY6CTNyMrYDouOrmBTLw1SX27Er49FLqX-_HboWJrblOlE2XV8QqCIM-hFlX3WtzUVzAQ7DIjz6roiYJcCohYGKap5Asn5a0VIiVco4tNU-khmT" />
                  </div>
                  <div>
                    <p className="font-bold text-[#dde4e1]">Alex Chen</p>
                    <p className="text-sm text-[#859490]">Creative Director, Lumina Studios</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col justify-center px-6 md:px-24 bg-[#0e1513]">
            <div className="max-w-md mx-auto w-full -mt-12">
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-[#dde4e1] tracking-tight mb-2">Create Account</h1>
                <p className="text-[#859490] text-lg">Join the community of elite professionals today.</p>
              </div>
              
              <div className="flex flex-col gap-3 mb-8">
                <button className="w-full flex items-center justify-center gap-3 bg-[#1a211f] hover:bg-[#252b2a] border border-[#3c4947] py-3.5 rounded-lg font-medium transition-all active:scale-[0.98]">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
                  <span>Continue with Google</span>
                </button>
              </div>
              
              <div className="relative flex items-center justify-center mb-8">
                <div className="flex-grow border-t border-[#3c4947]"></div>
                <span className="mx-4 text-xs font-bold text-[#859490] uppercase tracking-widest">Or use email</span>
                <div className="flex-grow border-t border-[#3c4947]"></div>
              </div>
              
              <form className="space-y-5" onSubmit={handleContinue}>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#bbcac6]">Usuario</label>
                  <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all" placeholder="Nombre de usuario" type="text" required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#bbcac6]">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all" placeholder="correo@ejemplo.com" type="email" required />
                </div>

                {error && <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-2 rounded-lg text-sm font-medium text-center">{error}</div>}

                <button className={`w-full bg-[#4fdbc8] text-[#003731] font-bold py-4 rounded-lg shadow-lg shadow-[#4fdbc8]/20 transition-all flex items-center justify-center gap-2 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#14b8a6] active:scale-[0.97]'}`} type="submit" disabled={isLoading}>
                  <span>{isLoading ? 'Comprobando datos...' : 'Continue'}</span>
                  {!isLoading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
                </button>
              </form>
            </div>
          </section>
        </main>
      )}

      {step === 2 && (
        <main className="flex-grow flex flex-col items-center justify-center px-4 h-full">
          <div className="w-full max-w-md -mt-12 md:-mt-8">
            <div className="mb-10 md:mb-6">
              <div className="flex justify-between mb-3 px-1">
                <span className="text-xs font-bold tracking-widest text-[#4fdbc8] uppercase">Step 2 of 3</span>
                <span className="text-xs font-medium text-[#859490]">Email Verification</span>
              </div>
              <div className="flex h-1.5 w-full bg-[#1a211f] rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#4fdbc8]/30"></div>
                <div className="h-full w-1/3 bg-[#4fdbc8]"></div>
                <div className="h-full w-1/3 bg-transparent"></div>
              </div>
            </div>

            <div className="bg-[#1a211f] rounded-xl p-8 border border-[#3c4947] shadow-2xl relative">
              <button onClick={() => setStep(1)} className="absolute top-6 left-6 flex items-center gap-1 text-[#859490] hover:text-[#4fdbc8] transition-colors font-medium text-sm">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back</span>
              </button>

              <div className="flex flex-col items-center mb-6 mt-2">
                <div className="w-20 h-20 bg-[#14b8a6]/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-[#14b8a6]/5">
                  <span className="material-symbols-outlined icon-filled text-[#4fdbc8] text-4xl">mail</span>
                </div>
                <h1 className="text-2xl font-bold text-[#dde4e1] mb-2 text-center">Check your inbox!</h1>
                <p className="text-[#bbcac6] text-center text-sm leading-relaxed">
                  We've sent a verification link to <span className="font-bold text-[#4fdbc8]">{formData.email}</span>. Click the link in the message to confirm your account.
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative py-2 flex items-center">
                  <div className="flex-grow border-t border-[#3c4947]"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#859490]">OR ENTER CODE</span>
                  <div className="flex-grow border-t border-[#3c4947]"></div>
                </div>
                
                <form className="space-y-4" onSubmit={handleVerifyOTP}>
                  <div className="flex justify-between gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input key={i} className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors" maxLength="1" placeholder="·" type="text"/>
                    ))}
                  </div>
                  <button type="submit" className="w-full bg-[#4fdbc8] text-[#003731] font-bold py-3.5 rounded-lg hover:bg-[#14b8a6] transition-all active:scale-[0.98] shadow-lg shadow-[#4fdbc8]/10">
                    Verify Code
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}

      {step === 3 && (
        <main className="flex-grow flex flex-col items-center justify-center pt-8 pb-12 px-4 md:pt-10 md:pb-8 h-full overflow-hidden">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch justify-center h-[90%]">
            <div className="w-full md:w-2/3 flex flex-col justify-center h-full relative">
              
              {/* Formulario ajustado: eliminada clase overflow-y-auto para evitar scroll */}
              <div id="final-form-card" className="w-full h-full bg-[#1a211f] border border-[#3c4947]/30 rounded-xl p-6 lg:px-10 lg:py-7 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2f3634]">
                  <div className="h-full bg-[#4fdbc8] w-full shadow-[0_0_10px_rgba(79,219,200,0.5)] transition-all duration-500"></div>
                </div>
                
                <div className="mb-4 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-bold text-[#dde4e1]">Final Personal Details</h1>
                    <span className="text-sm text-[#4fdbc8] font-semibold px-3 py-1 bg-[#14b8a6]/20 rounded-full border border-[#4fdbc8]/20">Step 3 of 3</span>
                  </div>
                  <p className="text-[#859490] text-sm">Tell us a bit more about yourself to finalize your profile.</p>
                </div>

                {/* Contenido principal del formulario: se usa flex-1 y justify-between para ocupar el espacio sin scroll */}
                <form className="flex flex-col flex-1 px-1" onSubmit={handleRegister}>
                  <div className="space-y-4">
                    {error && (
                      <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-1.5 rounded-lg text-xs font-medium text-center">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">First Name (Nom) *</label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">person</span>
                          <input name="nom" value={formData.nom} onChange={handleChange} required className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm" placeholder="John" type="text" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">Last Name (Cognoms) *</label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">badge</span>
                          <input name="cognoms" value={formData.cognoms} onChange={handleChange} required className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm" placeholder="Doe" type="text" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">Password *</label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">lock</span>
                          <input name="password" value={formData.password} onChange={handleChange} required className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm" placeholder="••••••••" type="password" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">Confirm Password *</label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">lock_reset</span>
                          <input name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm" placeholder="••••••••" type="password" />
                        </div>
                      </div>

                      <div className="space-y-1 relative">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">City/State (Población)</label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">location_on</span>
                          <input name="direccio" value={formData.direccio} onChange={handleDireccioChange} onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm" placeholder="Ej. Castelldefels" type="text" autoComplete="off" required />
                          {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-50 w-full mt-1 bg-[#1a211f] border border-[#3c4947] rounded-lg shadow-2xl max-h-32 overflow-y-auto custom-scrollbar">
                              {suggestions.map((suggestion, index) => (
                                <li key={index} onMouseDown={() => handleSelectSuggestion(suggestion)} className="px-4 py-2 text-xs text-[#dde4e1] hover:bg-[#2f3634] hover:text-[#4fdbc8] cursor-pointer transition-colors border-b border-[#3c4947]/50 last:border-none">{suggestion}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-[#bbcac6] ml-1">Phone Number</label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#4fdbc8] text-lg transition-colors">call</span>
                          <input name="telefon" value={formData.telefon} onChange={handleChange} className="w-full bg-[#2f3634] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all text-sm" placeholder="+34 600 000 000" type="tel" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#bbcac6] ml-1">Professional Bio</label>
                      <textarea name="biography" value={formData.biography} onChange={handleChange} className="w-full bg-[#2f3634] border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-inset focus:ring-[#4fdbc8] text-[#dde4e1] placeholder:text-[#859490]/50 outline-none transition-all resize-none text-sm" placeholder="Describe your experience..." rows="2"></textarea>
                    </div>
                  </div>

                  {/* Botones de acción posicionados al final */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 mt-auto">
                    <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 rounded-xl border border-[#3c4947] text-[#dde4e1] font-semibold hover:bg-[#2f3634] transition-all active:scale-[0.98] text-sm" type="button">Back</button>
                    <button disabled={isLoading} className={`flex-1 px-6 py-3 rounded-xl bg-[#4fdbc8] text-[#003731] font-bold shadow-lg shadow-[#4fdbc8]/20 transition-all text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'}`} type="submit">Complete Registration</button>
                  </div>
                </form>
              </div>
            </div>

            {/* CONTENEDORES DE LA DERECHA: ORIGINALES E INTACTOS */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 lg:gap-8 justify-center h-full">
              <div className="p-6 bg-[#161d1b] rounded-xl border border-[#3c4947]/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center text-[#4fdbc8] mb-4">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#dde4e1] mb-2">Secure Storage</h3>
                  <p className="text-xs lg:text-sm text-[#859490]">Your personal data is encrypted and stored according to strict security protocols.</p>
                </div>
              </div>
              
              <div className="p-6 bg-[#161d1b] rounded-xl border border-[#3c4947]/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-[#f38764]/20 flex items-center justify-center text-[#ffb59e] mb-4">
                  <span className="material-symbols-outlined">visibility_off</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#dde4e1] mb-2">Privacy Control</h3>
                  <p className="text-xs lg:text-sm text-[#859490]">Control what information is visible to other members in your settings later.</p>
                </div>
              </div>
              
              <div className="p-6 bg-[#161d1b] rounded-xl border border-[#3c4947]/20 flex flex-col items-center text-center w-full">
                <div className="w-10 h-10 rounded-lg bg-[#b9e9e0]/20 flex items-center justify-center text-[#a0d0c6] mb-4">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#dde4e1] mb-2">Quick Setup</h3>
                  <p className="text-xs lg:text-sm text-[#859490]">Almost there! After this step, your account will be live and ready for use.</p>
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