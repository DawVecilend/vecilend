import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProfile, getUserObjects } from "../../services/profile";
import { deleteObject, updateObjectStatus } from "../../services/objects";
import { AuthContext } from "../../contexts/AuthContext";
import ProductsSection from "../../components/home/ProductsSection";
import ConfirmDeleteModal from "../../components/elementos/ConfirmDeleteModal";
import NotFoundPage from "../main/NotFoundPage";
import RatingCard from "../../components/profile/RatingCard";
import RatingEvolutionChart from "../../components/profile/RatingEvolutionChart";
import UserReviewsList from "../../components/profile/UserReviewsList";
import { getReviewsEvolution } from "../../services/reviews";
import { createChat } from "../../services/chats";
import ReportModal from "../../components/elementos/ReportModal";
import BtnBack from "../../components/elementos/BtnBack";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [latestObjects, setLatestObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [evolution, setEvolution] = useState({
    propietari: [],
    solicitant: [],
  });

  const { username } = useParams();
  const navigate = useNavigate();
  const [contacting, setContacting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  const isOwnProfile = currentUser && currentUser.username === username;

  const visibleObjects = latestObjects;

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setNotFound(false);

      try {
        const { user, latest_objects } = await getProfile(username);
        setProfile(user);
        setLatestObjects(latest_objects || []);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        if (error.response?.status === 404) {
          setNotFound(true);
        }
        setProfile(null);
        setLatestObjects([]);
      } finally {
        setLoading(false);
      }

      try {
        const evo = await getReviewsEvolution(username);
        setEvolution(evo || { propietari: [], solicitant: [] });
      } catch (e) {
        console.error("Error cargando evolución:", e);
      }
    }

    loadProfile();
  }, [username, currentUser]);

  async function handleToggleVisibility(productId, currentStatus) {
    const nextStatus =
      currentStatus === "disponible" ? "no_disponible" : "disponible";

    const productToUpdate = latestObjects.find(
      (object) => object.id === productId,
    );

    if (!productToUpdate) {
      alert("No se ha encontrado el objeto");
      return;
    }

    try {
      await updateObjectStatus(productToUpdate, nextStatus);

      setLatestObjects((currentObjects) =>
        currentObjects.map((object) =>
          object.id === productId
            ? {
                ...object,
                estat: nextStatus,
              }
            : object,
        ),
      );
    } catch (error) {
      console.error("Error cambiando visibilidad:", error);
      console.error("Respuesta backend:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "No se ha podido cambiar la visibilidad del objeto",
      );
    }
  }

  function handleDeleteProduct(product) {
    setProductToDelete(product);
    setDeleteError(null);
    setConfirmDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteObject(productToDelete.id);

      setLatestObjects((currentObjects) =>
        currentObjects.filter((object) => object.id !== productToDelete.id),
      );

      setConfirmDeleteOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error eliminando objeto:", error);

      const message =
        error.response?.data?.message ||
        "No se ha podido eliminar el objeto. Inténtalo de nuevo.";

      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  }

  if (notFound) {
    return (
      <NotFoundPage
        title="Perfil no encontrado"
        message={`No existe ningún usuario con el nombre "${username}".`}
      />
    );
  }

  async function handleContact() {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!profile?.id) return;

    setContacting(true);
    try {
      const chat = await createChat({ user_id: profile.id });
      navigate(`/chats/${chat.id}`);
    } catch (e) {
      console.error("Error creando chat:", e);
      alert(
        e.response?.data?.message ||
          "No se ha podido abrir la conversación. Inténtalo de nuevo.",
      );
    } finally {
      setContacting(false);
    }
  }

  return (
    <div className="bg-app-bg text-app-text antialiased min-h-screen dark">
      <section className="pt-28 pb-12 px-4 max-w-7xl mx-auto space-y-24">
        <div className="-mt-20 md:hidden"><BtnBack /></div>
        <section className="relative bg-app-bg-secondary rounded-xl p-8 md:p-12 overflow-hidden">
          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            {/* ── Avatar ── */}
            <div className="relative shrink-0">
              <img
                alt="Foto de perfil"
                className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl"
                src={profile?.avatar_url || "/assets/icons/empty-user-icon.svg"}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-x-8 gap-y-6">
                <div className="space-y-4 min-w-0">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-app-text tracking-tight break-words">
                    {profile?.nom} {profile?.cognoms}
                  </h1>

                  <p className="flex items-center gap-1 text-app-text-secondary font-medium">
                    <span className="material-symbols-outlined !text-lg">
                      location_on
                    </span>
                    {profile?.direccio || "Ubicación no disponible"}
                  </p>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-vecilend-dark-primary">
                      Acerca de {profile?.nom}
                    </h2>
                    <p className="text-app-text-secondary leading-relaxed line-clamp-4 whitespace-pre-line">
                      {profile?.biography ||
                        "Este usuario aún no ha añadido biografía."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 self-start">
                  <RatingCard
                    value={profile?.total_transaccions ?? 0}
                    label="Transacciones"
                  />
                  <RatingCard
                    value={
                      profile?.resposta_rate != null
                        ? `${profile.resposta_rate}%`
                        : "-"
                    }
                    label="Respuesta"
                  />
                  <RatingCard
                    value={profile?.valoracio_propietari_avg ?? null}
                    label={`Como propietario${
                      profile?.valoracio_propietari_total
                        ? ` (${profile.valoracio_propietari_total})`
                        : ""
                    }`}
                    starred
                  />
                  <RatingCard
                    value={profile?.valoracio_solicitant_avg ?? null}
                    label={`Como solicitante${
                      profile?.valoracio_solicitant_total
                        ? ` (${profile.valoracio_solicitant_total})`
                        : ""
                    }`}
                    starred
                  />
                </div>
              </div>

              <div className="flex md:justify-end">
                {isOwnProfile ? (
                  <Link
                    to={`/settings/profile/${username}/editing`}
                    className="bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary text-[var(--color-app-success-on)] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-vecilend-dark-primary/25 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined !text-xl">
                      edit
                    </span>
                    Editar Perfil
                  </Link>
                ) : (
                  <div className="flex gap-3 flex-wrap md:justify-end">
                    <button
                      type="button"
                      onClick={handleContact}
                      disabled={contacting}
                      className="bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary text-[var(--color-app-success-on)] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-vecilend-dark-primary/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined !text-xl">mail</span>
                      {contacting ? "Abriendo…" : `Contacta a ${profile?.nom}`}
                    </button>
                    {currentUser && profile?.id && (
                      <button
                        type="button"
                        onClick={() => setReportOpen(true)}
                        className="text-app-text-secondary hover:text-red-400 px-4 py-4 rounded-full font-bold transition-colors flex items-center gap-2"
                        title="Reportar a este usuario"
                      >
                        <span className="material-symbols-outlined !text-xl">flag</span>
                        Reportar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-app-text">
            Evolución de las valoraciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RatingEvolutionChart
              data={evolution.propietari}
              title="Como propietario"
              color="#4fdbc8"
            />
            <RatingEvolutionChart
              data={evolution.solicitant}
              title="Como solicitante"
              color="#f38764"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-app-text">
              {isOwnProfile
                ? "Mis objetos publicados"
                : `Objetos de ${profile?.nom}`}
            </h2>

            {latestObjects.length > 0 && (
              <Link
                to={`/profile/${username}/objects`}
                className="text-vecilend-dark-primary font-bold hover:underline flex items-center gap-1"
              >
                Ver todos
              </Link>
            )}
          </div>

          {loading ? (
            <div className="rounded-lg border border-app-border bg-app-bg-secondary p-10 text-center">
              <p className="text-app-text-secondary">Cargando objetos...</p>
            </div>
          ) : latestObjects.length === 0 ? (
            <div className="rounded-lg border border-app-border bg-app-bg-secondary p-10 text-center">
              <p className="text-app-text-secondary">
                {isOwnProfile
                  ? "Aún no has publicado ningún objeto."
                  : `${profile?.nom || username} todavía no ha publicado objetos.`}
              </p>

              {isOwnProfile && (
                <Link
                  to="/objects/create"
                  className="inline-block mt-4 bg-vecilend-dark-primary text-[var(--color-app-success-on)] px-6 py-2.5 rounded-full font-bold hover:bg-vecilend-dark-primary"
                >
                  Publicar mi primer objeto
                </Link>
              )}
            </div>
          ) : (
            <>
              <ProductsSection
                title=""
                products={visibleObjects}
                profile={true}
                isOwnProfile={isOwnProfile}
                containerless
                onToggleVisibility={handleToggleVisibility}
                onDeleteProduct={handleDeleteProduct}
              />
            </>
          )}
        </section>

        <UserReviewsList username={username} />
      </section>

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => {
          if (!deleting) {
            setConfirmDeleteOpen(false);
            setProductToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar objeto?"
        message={`Vas a eliminar "${productToDelete?.title || "este objeto"}".`}
        description="Esta acción es permanente y borrará también todas las imágenes. Si tiene solicitudes pendientes o aceptadas, deberás resolverlas antes."
        confirmLabel="Sí, eliminar"
        busy={deleting}
        errorMessage={deleteError}
      />
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        usuariReportatId={profile?.id}
        usuariReportatNom={profile?.nom}
      />
    </div>
  );
}

export default ProfilePage;
