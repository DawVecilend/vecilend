import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile, getUserObjects } from "../services/profile";
import { deleteObject, updateObjectStatus } from "../services/objects";
import { AuthContext } from "../contexts/AuthContext";
import ProductsSection from "../components/home/ProductsSection";
import ConfirmDeleteModal from "../components/elementos/ConfirmDeleteModal";
import NotFoundPage from "./NotFoundPage";
import RatingCard from "../components/profile/RatingCard";
import RatingEvolutionChart from "../components/profile/RatingEvolutionChart";
import UserReviewsList from "../components/profile/UserReviewsList";
import { getReviewsEvolution } from "../services/reviews";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [latestObjects, setLatestObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleObjectsCount, setVisibleObjectsCount] = useState(15);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [evolution, setEvolution] = useState({
    propietari: [],
    solicitant: [],
  });

  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const isOwnProfile = currentUser && currentUser.username === username;

  const visibleObjects = isOwnProfile
    ? latestObjects.slice(0, visibleObjectsCount)
    : latestObjects;

  const hasMoreOwnObjects =
    isOwnProfile && visibleObjectsCount < latestObjects.length;

  const remainingObjects = latestObjects.length - visibleObjectsCount;
  const nextObjectsCount = remainingObjects >= 15 ? 15 : remainingObjects;

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setNotFound(false);
      setVisibleObjectsCount(15);

      try {
        const { user, latest_objects } = await getProfile(username);
        setProfile(user);

        const ownProfile = currentUser && currentUser.username === username;

        if (ownProfile) {
          const allUserObjects = await getUserObjects(username);
          setLatestObjects(allUserObjects || []);
        } else {
          setLatestObjects(latest_objects || []);
        }
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
      alert("No se ha encontrado el producto");
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
          "No se ha podido cambiar la visibilidad del producto",
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
      console.error("Error eliminando producto:", error);

      const message =
        error.response?.data?.message ||
        "No se ha podido eliminar el producto. Inténtalo de nuevo.";

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

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased min-h-screen dark">
      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto space-y-24">
        <section className="relative bg-[#161d1b] rounded-xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <span className="material-symbols-outlined !text-[20rem] text-[#4fdbc8] rotate-12">
              camera_enhance
            </span>
          </div>

          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <img
                alt="Foto de perfil"
                className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl"
                src={profile?.avatar_url || "/assets/icons/empty-user-icon.svg"}
              />
              <div className="absolute -bottom-3 -right-3 bg-[#f38764] text-[#6c2106] px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border border-white">
                <span className="material-symbols-outlined icon-filled text-sm">
                  verified
                </span>
                Verificado
              </div>
            </div>

            {/* Columna dreta: nom + 4 tarjetes + ubicació + bio + botó */}
            <div className="flex-1 space-y-5 w-full">
              {/* Nom */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#dde4e1] tracking-tight">
                {profile?.nom} {profile?.cognoms}
              </h1>

              {/* 4 tarjetes */}
              <div className="flex flex-wrap gap-3">
                <RatingCard
                  value={profile?.total_transaccions ?? 0}
                  label="Transacciones"
                />
                <RatingCard value="100%" label="Respuesta" />
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

              {/* Ubicació real (municipi) */}
              <p className="flex items-center gap-1 text-[#bbcac6] font-medium">
                <span className="material-symbols-outlined !text-lg">
                  location_on
                </span>
                {profile?.direccio || "Ubicación no disponible"}
              </p>

              {/* Acerca de... */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#4fdbc8]">
                  Acerca de {profile?.nom}
                </h2>
                <p className="text-[#bbcac6] leading-relaxed">
                  {profile?.biography ||
                    "Este usuario aún no ha añadido biografía."}
                </p>
              </div>

              {/* Botó */}
              <div className="flex gap-4 pt-2">
                {isOwnProfile ? (
                  <Link
                    to={`/settings/profile/${username}/editing`}
                    className="bg-gradient-to-br from-[#4fdbc8] to-[#14b8a6] text-[#003731] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[#4fdbc8]/25 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined !text-xl">
                      edit
                    </span>
                    Editar Perfil
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="bg-gradient-to-br from-[#4fdbc8] to-[#14b8a6] text-[#003731] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[#4fdbc8]/25 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined !text-xl">
                      mail
                    </span>
                    Contacta a {profile?.nom}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#dde4e1]">
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
            <h2 className="text-3xl font-extrabold tracking-tight text-[#dde4e1]">
              {isOwnProfile
                ? "Mis objetos publicados"
                : `Objetos de ${profile?.nom}`}
            </h2>

            {latestObjects.length > 0 && !isOwnProfile && (
              <Link
                to={`/profile/${username}/objects`}
                className="text-[#4fdbc8] font-bold hover:underline flex items-center gap-1"
              >
                Ver todos
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="rounded-lg border border-[#3c4947] bg-[#161d1b] p-10 text-center">
              <p className="text-[#bbcac6]">Cargando productos...</p>
            </div>
          ) : latestObjects.length === 0 ? (
            <div className="rounded-lg border border-[#3c4947] bg-[#161d1b] p-10 text-center">
              <p className="text-[#bbcac6]">
                {isOwnProfile
                  ? "Aún no has publicado ningún objeto."
                  : `${profile?.nom || username} todavía no ha publicado objetos.`}
              </p>

              {isOwnProfile && (
                <Link
                  to="/objects/create"
                  className="inline-block mt-4 bg-[#4fdbc8] text-[#003731] px-6 py-2.5 rounded-full font-bold hover:bg-[#14b8a6]"
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
                onToggleVisibility={handleToggleVisibility}
                onDeleteProduct={handleDeleteProduct}
              />

              {hasMoreOwnObjects && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleObjectsCount((current) => current + 15)
                    }
                    className="rounded-full bg-[#4fdbc8] px-8 py-3 font-bold text-[#003731] transition-colors hover:bg-[#14b8a6] active:scale-95"
                  >
                    Ver más {nextObjectsCount > 0 && `(${nextObjectsCount})`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <UserReviewsList username={username} />
      </main>

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
        title="¿Eliminar producto?"
        message={`Vas a eliminar "${productToDelete?.title || "este producto"}".`}
        description="Esta acción es permanente y borrará también todas las imágenes. Si tiene solicitudes pendientes o aceptadas, deberás resolverlas antes."
        confirmLabel="Sí, eliminar"
        busy={deleting}
        errorMessage={deleteError}
      />
    </div>
  );
}

export default ProfilePage;
