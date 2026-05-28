import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/profile";
import { AuthContext } from "../../contexts/AuthContext";
import municipalitiesData from "../../data/municipios.json";
import SettingsNav from "../../components/layouts/SettingsNav";
import { normalizeString } from "../../utils/string";
import ObjectMiniMap from "../../components/map/ObjectMiniMap";

function EditProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, getUser } = useContext(AuthContext);
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
    avatar: null,
    ubicacio: null,
  });

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const { user } = await getProfile(username);
        setProfile(user);

        // Si el perfil ya tiene una dirección con municipio conocido, prefijamos
        // las coordenadas a partir del json para poder pintar el mapa.
        let initialUbicacio = null;
        if (user.direccio) {
          const found = municipalitiesData.find(
            (m) => normalizeString(m.name) === normalizeString(user.direccio),
          );
          if (found) initialUbicacio = { lat: found.lat, lng: found.lng };
        }

        setFormData({
          nom: user.nom || "",
          cognoms: user.cognoms || "",
          telefon: user.telefon || "",
          direccio: user.direccio || "",
          biography: user.biography || user.descripcio || "",
          avatar: null,
          ubicacio: initialUbicacio,
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
    const { name } = e.target;
    let value = e.target.value;
    if (name === "nom" || name === "cognoms") {
      value = value.replace(/[0-9]/g, "");
    } else if (name === "telefon") {
      value = value.replace(/[^0-9+\s()-]/g, "");
    }
    setFormData({ ...formData, [name]: value });
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
      let initialUbicacio = null;
      if (profile.direccio) {
        const found = municipalitiesData.find(
          (m) => normalizeString(m.name) === normalizeString(profile.direccio),
        );
        if (found) initialUbicacio = { lat: found.lat, lng: found.lng };
      }

      setFormData({
        nom: profile.nom || "",
        cognoms: profile.cognoms || "",
        telefon: profile.telefon || "",
        direccio: profile.direccio || "",
        biography: profile.biography || profile.descripcio || "",
        avatar: null,
        ubicacio: initialUbicacio,
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
      <div className="bg-app-bg text-app-text antialiased font-inter min-h-[calc(100vh-80px)]">
        <div className="mx-auto w-full max-w-[1380px] px-4 md:px-8 py-3 md:py-6">
          <div className="flex flex-col md:flex-row md:items-stretch gap-0 md:gap-6 md:min-h-[calc(100vh-80px-48px)]">
            <SettingsNav username={user?.username} current="profile" />

            <section className="flex-1 min-w-0 p-0 md:p-6">
              <header className="mb-8">
                <div className="h-10 md:h-12 w-64 md:w-80 bg-app-bg-card-secondary/40 rounded animate-pulse" />
                <div className="mt-3 h-5 w-72 md:w-96 bg-app-bg-card-secondary/40 rounded animate-pulse" />
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-app-bg-card-secondary/40 rounded-xl p-6 border border-app-border/20">
                    <div className="w-32 h-32 mx-auto mb-4 bg-app-bg-card rounded-full animate-pulse" />
                  </div>
                  <div className="bg-app-bg-card-secondary/40 rounded-xl p-2 border border-app-border/20">
                    <div className="h-[220px] w-full bg-app-bg-card rounded-lg animate-pulse" />
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="bg-app-bg-card-secondary/40 rounded-xl p-8 border border-app-border/20">
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
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-app-bg text-app-text antialiased font-inter min-h-[calc(100vh-80px)]">
      <div className="mx-auto w-full max-w-[1380px] px-4 md:px-8 py-3 md:py-6">
        <div className="flex flex-col md:flex-row md:items-stretch gap-0 md:gap-6 md:min-h-[calc(100vh-80px-48px)]">
          <SettingsNav username={user?.username} current="profile" />

          <section className="flex-1 min-w-0 p-0 md:p-6">
            <header className="mb-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-app-text mb-2 tracking-tight">
                Perfil de{" "}
                <span className="text-app-primary">Usuario</span>
              </h1>
              <p className="text-app-text-secondary text-base md:text-lg max-w-2xl leading-relaxed">
                Gestiona tu identidad y preferencias en Vecilend.
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:items-stretch"
            >
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-app-bg-card-secondary/40 backdrop-blur-md rounded-xl p-6 border border-app-border/20 shadow-xl flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-2">
                    <img
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full border-2 border-app-primary/30"
                      src={
                        previewImage ||
                        profile.avatar_url ||
                        "/assets/icons/empty-user-icon.svg"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      aria-label="Cambiar foto de perfil"
                      title="Cambiar foto de perfil"
                      className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-app-primary text-[var(--color-app-success-on)] shadow-lg border-2 border-app-bg hover:bg-app-primary-hover transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                  </div>
                  <input aria-label="Subir avatar"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                {formData.ubicacio && (
                  <div className="bg-app-bg-card-secondary/40 backdrop-blur-md rounded-xl p-3 border border-app-border/20 shadow-xl">
                    <p className="text-[10px] font-bold text-app-text-secondary uppercase tracking-widest ml-1 mb-2">
                      Ubicación
                    </p>
                    <ObjectMiniMap
                      ubicacio={formData.ubicacio}
                      nom={formData.direccio || "Municipio"}
                    />
                    <p className="text-[10px] text-app-text-secondary mt-2 leading-relaxed">
                      Para cambiar la ubicación, modifica el municipio en el
                      campo «Dirección».
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-8 flex flex-col">
                <div className="bg-app-bg-card-secondary/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-app-border/20 shadow-xl flex-1 flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                        Nombre
                      </label>
                      <input aria-label="Nombre"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-app-primary outline-none transition-all"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                        Apellidos
                      </label>
                      <input aria-label="Apellidos"
                        name="cognoms"
                        value={formData.cognoms}
                        onChange={handleChange}
                        className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-app-primary outline-none transition-all"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                        Teléfono
                      </label>
                      <input aria-label="Teléfono"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-app-primary outline-none transition-all"
                        type="text"
                        placeholder="612 345 678"
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                        Dirección
                      </label>
                      <input aria-label="Dirección"
                        name="direccio"
                        value={formData.direccio}
                        onChange={handleDireccioChange}
                        onFocus={() => {
                          if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 200)
                        }
                        className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-app-primary outline-none transition-all"
                        type="text"
                        autoComplete="off"
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-50 w-full mt-1 bg-app-bg-card-secondary border border-app-border rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                          {suggestions.map((suggestion) => (
                            <li
                              key={suggestion.id}
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="px-4 py-2.5 text-sm text-app-text hover:bg-app-bg-card-secondary hover:text-app-primary cursor-pointer transition-colors border-b border-app-border/50 last:border-none"
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
                    <div className="md:col-span-2 space-y-2 flex flex-col flex-1">
                      <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest ml-1">
                        Biografía
                      </label>
                      <textarea aria-label="Biografía"
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        maxLength={255}
                        rows={4}
                        className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text focus:border-app-primary outline-none resize-none transition-all flex-1 min-h-[120px]"
                      ></textarea>
                      <p className="text-[10px] text-app-text-secondary mt-1 text-right">
                        {(formData.biography || "").length} / 255
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-full flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="px-6 py-3 text-sm font-bold text-app-text-secondary hover:text-app-text transition-colors"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 md:px-10 py-3 bg-app-primary text-[var(--color-app-success-on)] font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all hover:bg-app-primary-hover"
                  >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>

                <div className="flex items-center">
                  {successMessage && (
                    <div className="bg-app-primary/10 border border-app-primary/50 text-app-primary px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse w-fit">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      <p className="font-semibold text-xs tracking-wide uppercase">
                        {successMessage}
                      </p>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="bg-[var(--color-app-danger)]/10 border border-[var(--color-app-danger)]/50 text-[var(--color-app-danger)] px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse w-fit">
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
          </section>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;
