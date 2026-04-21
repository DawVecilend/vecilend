import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/profile';
import { AuthContext } from '../contexts/AuthContext';
import municipalitiesData from '../data/municipios.json';

function EditProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, getUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    cognoms: '',
    telefon: '',
    direccio: '',
    biography: '',
    radi_proximitat: 10,
    avatar: null
  });

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const data = await getProfile(username);
        setProfile(data);
        setFormData({
          nom: data.nom || '',
          cognoms: data.cognoms || '',
          telefon: data.telefon || '',
          direccio: data.direccio || '',
          biography: data.biography || data.descripcio || '',
          radi_proximitat: data.radi_proximitat || 10,
          avatar: null
        });
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreviewImage(URL.createObjectURL(file));
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

  const handleDiscard = () => {
    if (profile) {
      setFormData({
        nom: profile.nom || '',
        cognoms: profile.cognoms || '',
        telefon: profile.telefon || '',
        direccio: profile.direccio || '',
        biography: profile.biography || profile.descripcio || '',
        radi_proximitat: profile.radi_proximitat || 10,
        avatar: null
      });
      setPreviewImage(null);
      setSuccessMessage('');
      setErrorMessage('');
      setShowSuggestions(false);
      
      // Limpiamos el valor del input file para permitir volver a seleccionar la misma foto
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await updateProfile(username, formData);
      await getUser(); 
      const updatedData = await getProfile(username);
      setProfile(updatedData);
      setSuccessMessage('¡Cambios guardados con éxito!');
      setPreviewImage(null);
      
      // Limpiamos el valor del input file tras guardar con éxito
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422 && err.response.data?.errors) {
        const validationErrors = err.response.data.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        setErrorMessage(validationErrors[firstErrorKey][0]);
      } else {
        setErrorMessage(err.response?.data?.message || "Error al guardar los cambios. Inténtalo de nuevo.");
      }
    } finally { 
      setIsSaving(false); 
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0e1513]">
        <div className="text-[#4fdbc8] text-xl font-bold animate-pulse">Cargando perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#0e1513] gap-4">
        <h2 className="text-xl text-red-500 font-bold">Error al cargar el perfil</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#21514a] text-white rounded-lg">Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="flex text-[#dde4e1] antialiased">
      <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-80px)] flex-col p-4 bg-[#090f0e] w-64 border-r border-[#3c4947] transition-all duration-150 font-inter text-sm z-40">
        <div className="mb-8 px-2">
          <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
          <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
        </div>
        <nav className="space-y-1">
          <Link to={`/settings/profile/${username}/editing`} className="flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/10 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] transition-all duration-150">
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
            <span className="material-symbols-outlined">security</span>
            <span>Security</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
            <span className="material-symbols-outlined">notifications</span>
            <span>Notifications</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
            <span className="material-symbols-outlined">payments</span>
            <span>Payments</span>
          </Link>
        </nav>
      </aside>

      <main className="md:ml-64 flex-1 p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#dde4e1] mb-2 tracking-tight">Perfil de Usuario</h1>
          <p className="text-[#bbcac6]">Gestiona tu identidad y preferencias en Vecilend.</p>
        </header>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1a211f] rounded-xl p-6 border border-[#3c4947]/20 shadow-xl text-center">
              <div className="relative group w-40 h-40 mx-auto mb-6">
                <img 
                  alt="Avatar" 
                  className="w-full h-full object-cover rounded-xl border-2 border-[#4fdbc8]/20" 
                  src={previewImage || profile.avatar_url || '/assets/icons/empty-user-icon.svg'} 
                />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button type="button" onClick={() => fileInputRef.current.click()} className="w-full py-2 bg-[#21514a] text-[#92c2b8] rounded-lg text-xs font-bold transition-colors hover:bg-[#161d1b]">
                Cambiar foto
              </button>
            </div>

            <div className="bg-[#1a211f] rounded-xl p-6 border border-[#3c4947]/20 shadow-xl">
              <label className="text-xs font-bold text-[#bbcac6] uppercase block mb-4">
                Radio de Proximidad ({formData.radi_proximitat} km)
              </label>
              <input 
                type="range" name="radi_proximitat" min="1" max="100" 
                value={formData.radi_proximitat} onChange={handleChange}
                className="w-full h-2 bg-[#161d1b] rounded-lg appearance-none cursor-pointer accent-[#4fdbc8]"
              />
              <p className="text-[10px] text-[#859490] mt-2 italic">Define la distancia máxima para buscar y prestar objetos.</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#1a211f] rounded-xl p-8 border border-[#3c4947]/20 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Nombre</label>
                  <input name="nom" value={formData.nom} onChange={handleChange} className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] outline-none transition-all" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Apellidos</label>
                  <input name="cognoms" value={formData.cognoms} onChange={handleChange} className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] outline-none transition-all" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Teléfono</label>
                  <input name="telefon" value={formData.telefon} onChange={handleChange} className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] outline-none transition-all" type="text" placeholder="Ej: 600 000 000" />
                </div>
                
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Ubicación principal</label>
                  <input 
                    name="direccio" 
                    value={formData.direccio} 
                    onChange={handleDireccioChange}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] outline-none transition-all" 
                    type="text" 
                    autoComplete="off"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-[#1a211f] border border-[#3c4947] rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                      {suggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          onMouseDown={() => handleSelectSuggestion(suggestion)}
                          className="px-4 py-2.5 text-sm text-[#dde4e1] hover:bg-[#2f3634] hover:text-[#4fdbc8] cursor-pointer transition-colors border-b border-[#3c4947]/50 last:border-none"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Biografía</label>
                  <textarea name="biography" value={formData.biography} onChange={handleChange} className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] outline-none resize-none transition-all" rows="4"></textarea>
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="bg-[#4fdbc8]/10 border border-[#4fdbc8]/50 text-[#4fdbc8] px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <p className="font-semibold text-xs tracking-wide uppercase">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/50 text-[#ef4444] px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                <span className="material-symbols-outlined text-sm">error</span>
                <p className="font-semibold text-xs tracking-wide uppercase">{errorMessage}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-4">
              <button type="button" onClick={handleDiscard} className="px-6 py-3 text-sm font-bold text-[#859490] hover:text-[#dde4e1] transition-colors">
                Descartar
              </button>
              <button type="submit" disabled={isSaving} className="px-10 py-3 bg-[#4fdbc8] text-[#003731] font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all hover:bg-[#14b8a6]">
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProfilePage;