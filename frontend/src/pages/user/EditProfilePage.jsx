import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/profile";
import { AuthContext } from "../../contexts/AuthContext";
import municipalitiesData from "../../data/municipios.json";
import HeaderDesktop from "../../components/layouts/header/HeaderDesktop";
import { normalizeString } from "../../utils/string";

function EditProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, currentUser, getUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    cognoms: "",
    telefon: "",
    direccio: "",
    biography: "",
    radi_proximitat: 10,
    avatar: null,
    ubicacio: null,
  });

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const { user } = await getProfile(username);
        setProfile(user);
        setFormData({
          nom: user.nom || "",
          cognoms: user.cognoms || "",
          telefon: user.telefon || "",
          direccio: user.direccio || "",
          biography: user.biography || user.descripcio || "",
          radi_proximitat: user.radi_proximitat || 10,
          avatar: null,
        });
      } catch (error) {
        console.error(error);
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

  const handleDiscard = () => {
    if (profile) {
      setFormData({
        nom: profile.nom || "",
        cognoms: profile.cognoms || "",
        telefon: profile.telefon || "",
        direccio: profile.direccio || "",
        biography: profile.biography || profile.descripcio || "",
        radi_proximitat: profile.radi_proximitat || 10,
        avatar: null,
      });
      setPreviewImage(null);
      setSuccessMessage("");
      setErrorMessage("");
      setShowSuggestions(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await updateProfile(username, formData);
      await getUser();
      const { user: updatedUser } = await getProfile(username);
      setProfile(updatedUser);
      setSuccessMessage("¡Cambios guardados!");
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        const validationErrors = err.response.data.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        setErrorMessage(validationErrors[firstErrorKey][0]);
      } else {
        setErrorMessage(err.response?.data?.message || "Error al guardar.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-app-bg text-app-text antialiased flex flex-col">
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Sidebar (no animem la nav, només els blocs interns) */}
          <aside className="hidden md:flex flex-col p-4 bg-[#090f0e] w-64 border-r border-app-border">
            <div className="mb-8 px-2">
              <div className="h-5 w-32 bg-app-bg-card rounded animate-pulse" />
              <div className="mt-2 h-3 w-40 bg-app-bg-card rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-app-bg-card rounded animate-pulse"
                />
              ))}
            </div>
          </aside>

          <main className="flex-1 p-6 md:px-12 lg:px-16 max-w-7xl mx-auto bg-app-bg">
            <header className="mb-8">
              <div className="h-12 w-80 bg-[#2f3634]/40 rounded animate-pulse" />
              <div className="mt-3 h-5 w-96 bg-[#2f3634]/40 rounded animate-pulse" />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Columna esquerra: avatar + slider */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#2f3634]/40 rounded-xl p-6 border border-app-border/20">
                  <div className="w-36 h-36 mx-auto mb-4 bg-app-bg-card rounded-xl animate-pulse" />
                  <div className="h-9 w-full bg-app-bg-card rounded-lg animate-pulse" />
                </div>
                <div className="bg-[#2f3634]/40 rounded-xl p-6 border border-app-border/20">
                  <div className="h-3 w-40 bg-app-bg-card rounded animate-pulse mb-4" />
                  <div className="h-2 w-full bg-app-bg-card rounded animate-pulse" />
                </div>
              </div>

              {/* Columna dreta: 5 camps */}
              <div className="lg:col-span-8">
                <div className="bg-[#2f3634]/40 rounded-xl p-8 border border-app-border/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-3 w-24 bg-app-bg-card rounded animate-pulse" />
                        <div className="h-12 w-full bg-app-bg-card rounded-lg animate-pulse" />
                      </div>
                    ))}
                    <div className="md:col-span-2 space-y-2">
                      <div className="h-3 w-24 bg-app-bg-card rounded animate-pulse" />
                      <div className="h-28 w-full bg-app-bg-card rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-app-bg text-app-text antialiased flex flex-col dark">
      {/* Contenedor con la altura calculada exacta */}
      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="hidden md:flex flex-col p-4 bg-[#090f0e] w-64 border-r border-app-border transition-all duration-150 font-inter text-sm z-40">
          <div className="mb-8 px-2">
            <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
            <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
          </div>
          <nav className="space-y-1">
            <Link
              to={`/settings/profile/${user?.username}`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-app-bg-card hover:text-app-text transition-all duration-150"
            >
              <span className="material-symbols-outlined">home</span>
              <span>Página principal</span>
            </Link>
            <Link
              to={`/settings/profile/${user?.username}/editing`}
              className="flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/10 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] transition-all duration-150"
            >
              <span className="material-symbols-outlined">person</span>
              <span>Perfil</span>
            </Link>
            <Link
              to={`/settings/profile/${user?.username}/security`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-app-bg-card hover:text-app-text transition-all duration-150"
            >
              <span className="material-symbols-outlined">security</span>
              <span>Seguridad</span>
            </Link>
            <Link
              to={`/settings/profile/${user?.username}/notifications`}
              className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-app-bg-card hover:text-app-text transition-all duration-150"
            >
              <span className="material-symbols-outlined">privacy</span>
              <span>Privacidad</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:px-12 lg:px-16 max-w-7xl mx-auto bg-app-bg flex flex-col justify-center">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-app-text mb-2 tracking-tight">
              Perfil de <span className="text-[#4fdbc8]">Usuario</span>
            </h1>
            <p className="text-app-text-secondary text-lg max-w-2xl leading-relaxed">
              Gestiona tu identidad y preferencias en Vecilend.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#2f3634]/40 backdrop-blur-md rounded-xl p-6 border border-app-border/20 shadow-xl text-center">
                <div className="relative group w-36 h-36 mx-auto mb-4">
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-xl border-2 border-[#4fdbc8]/20"
                    src={
                      previewImage ||
                      profile.avatar_url ||
                      "/assets/icons/empty-user-icon.svg"
                    }
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-2 bg-[#21514a] text-[#92c2b8] rounded-lg text-xs font-bold transition-colors hover:bg-app-bg-card"
                >
                  Cambiar foto
                </button>
              </div>

              <div className="bg-[#2f3634]/40 backdrop-blur-md rounded-xl p-6 border border-app-border/20 shadow-xl">
                <label className="text-xs font-bold text-app-text-secondary uppercase block mb-4">
                  Radio de Proximidad ({formData.radi_proximitat} km)
                </label>
                <input
                  type="range"
                  name="radi_proximitat"
                  min="1"
                  max="100"
                  value={formData.radi_proximitat}
                  onChange={handleChange}
                  className="w-full h-2 bg-app-bg-card rounded-lg appearance-none cursor-pointer accent-[#4fdbc8]"
                />
                <p className="text-[10px] text-[#859490] mt-2 italic">
                  Define la distancia máxima para buscar y prestar objetos.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="bg-[#2f3634]/40 backdrop-blur-md rounded-xl p-8 border border-app-border/20 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                      Nombre
                    </label>
                    <input
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-[#4fdbc8] outline-none transition-all"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                      Apellidos
                    </label>
                    <input
                      name="cognoms"
                      value={formData.cognoms}
                      onChange={handleChange}
                      className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-[#4fdbc8] outline-none transition-all"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                      Teléfono
                    </label>
                    <input
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-[#4fdbc8] outline-none transition-all"
                      type="text"
                      placeholder="600 000 000"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                      Ubicación principal
                    </label>
                    <input
                      name="direccio"
                      value={formData.direccio}
                      onChange={handleDireccioChange}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      }
                      className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-[#4fdbc8] outline-none transition-all"
                      type="text"
                      autoComplete="off"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="absolute z-50 w-full mt-1 bg-[#1a211f] border border-app-border rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.id}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="px-4 py-2.5 text-sm text-app-text hover:bg-[#2f3634] hover:text-[#4fdbc8] cursor-pointer transition-colors border-b border-app-border/50 last:border-none"
                          >
                            <span className="font-medium">
                              {suggestion.name}
                            </span>
                            <span className="text-xs text-[#859490] ml-2">
                              {suggestion.province}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                      Biografía
                    </label>
                    <textarea
                      name="biography"
                      value={formData.biography}
                      onChange={handleChange}
                      maxLength={255}
                      rows={4}
                      className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-[#4fdbc8] outline-none resize-none transition-all"
                    ></textarea>
                    <p className="text-[10px] text-[#859490] mt-1 text-right">
                      {(formData.biography || "").length} / 255
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-full flex items-center gap-6 mt-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-6 py-3 text-sm font-bold text-[#859490] hover:text-app-text transition-colors"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-10 py-3 bg-[#4fdbc8] text-[#003731] font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all hover:bg-[#14b8a6]"
                >
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>

              <div className="flex items-center">
                {successMessage && (
                  <div className="bg-[#4fdbc8]/10 border border-[#4fdbc8]/50 text-[#4fdbc8] px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse w-fit">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    <p className="font-semibold text-xs tracking-wide uppercase">
                      {successMessage}
                    </p>
                  </div>
                )}
                {errorMessage && (
                  <div className="bg-[#ef4444]/10 border border-[#ef4444]/50 text-[#ef4444] px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse w-fit">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    <p className="font-semibold text-xs tracking-wide uppercase">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default EditProfilePage;
