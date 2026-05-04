import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile, getUserObjects } from "../services/profile";
import { deleteObject, updateObjectStatus } from "../services/objects";
import { AuthContext } from "../contexts/AuthContext";
import ProductsSection from "../components/home/ProductsSection";
import ConfirmDeleteModal from "../components/elementos/ConfirmDeleteModal";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [latestObjects, setLatestObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleObjectsCount, setVisibleObjectsCount] = useState(15);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
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
        setProfile(null);
        setLatestObjects([]);
      } finally {
        setLoading(false);
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

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased min-h-screen dark">
      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto space-y-24">
        <section className="relative bg-[#161d1b] rounded-xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <span className="material-symbols-outlined !text-[20rem] text-[#4fdbc8] rotate-12">
              camera_enhance
            </span>
          </div>

          <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative group">
              <img
                alt="Foto de perfil"
                className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl scale-105 group-hover:scale-100 transition-transform duration-500"
                src={profile?.avatar_url || "/assets/icons/empty-user-icon.svg"}
              />

              <div className="absolute -bottom-3 -right-3 bg-[#f38764] text-[#6c2106] px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border border-white">
                <span className="material-symbols-outlined icon-filled text-sm">
                  verified
                </span>
                Verificado
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#dde4e1] tracking-tight">
                  {profile?.nom} {profile?.cognoms}
                </h1>

                <p className="flex items-center gap-1 text-[#bbcac6] font-medium mt-1">
                  <span className="material-symbols-outlined !text-lg">
                    location_on
                  </span>
                  {profile?.direccio || "Ubicación no disponible"}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-[#090f0e] px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-[#4fdbc8] font-bold text-xl">350+</span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#859490]">
                    Alquileres
                  </span>
                </div>

                <div className="bg-[#090f0e] px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-[#4fdbc8] font-bold text-xl">100%</span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#859490]">
                    Respuesta
                  </span>
                </div>

                <div className="bg-[#090f0e] px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <span className="text-[#4fdbc8] font-bold text-xl">
                      4.9
                    </span>

                    <span className="material-symbols-outlined icon-filled text-orange-500 text-sm">
                      star
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#859490]">
                    Puntuación
                  </span>
                </div>
              </div>

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
                  <>
                    <button className="bg-gradient-to-br from-[#4fdbc8] to-[#14b8a6] text-[#003731] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[#4fdbc8]/25 active:scale-95 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined !text-xl">
                        mail
                      </span>
                      Contacta a {profile?.nom}
                    </button>

                    <button className="bg-[#21514a] text-[#92c2b8] px-8 py-4 rounded-full font-bold hover:bg-[#bbece2] transition-colors active:scale-95">
                      Seguir
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-[#090f0e] p-8 rounded-lg space-y-6">
            <h2 className="text-2xl font-bold text-[#4fdbc8]">
              Acerca de {profile?.nom}
            </h2>

            <div className="space-y-4 text-[#bbcac6] leading-relaxed">
              <p>{profile?.biography || "Descripción no disponible"}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="bg-[#252b2a] px-4 py-2 rounded-full text-sm font-semibold">
                Cinematography
              </span>

              <span className="bg-[#252b2a] px-4 py-2 rounded-full text-sm font-semibold">
                Color Grading
              </span>

              <span className="bg-[#252b2a] px-4 py-2 rounded-full text-sm font-semibold">
                Technical Advisor
              </span>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#4fdbc8] text-[#003731] p-8 rounded-lg relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-20 transform group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined !text-[12rem]">
                verified_user
              </span>
            </div>

            <h3 className="text-xl font-bold mb-6">Lender Commitment</h3>

            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">
                  check_circle
                </span>

                <p className="text-sm font-medium">
                  Same-day inspection on all returns
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">
                  check_circle
                </span>

                <p className="text-sm font-medium">
                  Sensor cleaning before every body rental
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">
                  check_circle
                </span>

                <p className="text-sm font-medium">
                  Firmware kept up to date monthly
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">
                  check_circle
                </span>

                <p className="text-sm font-medium">
                  Flexible pickup in Williamsburg
                </p>
              </li>
            </ul>
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

        <section className="space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#dde4e1]">
            Reviews from Filmmakers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#161d1b] p-8 rounded-lg space-y-4 border-l-4 border-[#4fdbc8]">
              <div className="flex items-center gap-4">
                <img
                  alt="User Profile"
                  className="w-12 h-12 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeEqSaikQJZ9NyhaeByH7mNkoQaDgO_9cyQiWUksGlDctNMV0--xgG-UcMBJDNVrQmfNQYR3YO8eTQDfBln6kVPTsnElbQkorJAiH6_aAihwvGCnhudhzqU6XC1THU08yyo9voih6Vizg0zdjS42_N9T-hMApuFRwzd_v_4wTRAmo-cKdTegtEhxYr9AdRK7l0qvDKlqFSuw_Ym7T3HaELXNjQNll5t_Uev_uYODmlCmfFw1eq3L5WB1iJCkjwFk8xRLvx8EVSiEdS"
                />

                <div>
                  <h4 className="font-bold text-[#dde4e1]">David S.</h4>

                  <div className="flex">
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#bbcac6] italic">
                "Marcus is the gold standard for gear rental. The A7 kit was
                immaculate, batteries were fully charged, and he even included
                extra lens tissues. Will definitely rent from him again!"
              </p>
            </div>

            <div className="bg-[#161d1b] p-8 rounded-lg space-y-4 border-l-4 border-[#4fdbc8]">
              <div className="flex items-center gap-4">
                <img
                  alt="User Profile"
                  className="w-12 h-12 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT73IMdFWPKHxMqksyR2MCl4XQcJ1X0CXN0AuGLaIsDsCXq-tuIibwjcU_1BmOGXse2LDOy66gcF2Hl92iZrf6wYHmnHIx-BVGUr6m7V3PIBsg5lD8qAdIuj14q2O8CgvgX85B6RYhiiQxfR249Gns_KiJi3cxwndjmI2YJ9FGoKj1xa0KSyRWgI4ZXYkPhhOeDYzLw_ktDwt04Bz3YMM-pT2XXwLfnEob_kDTsLlJeuH_J8Otfey4nZ6XiKlu-7IXA9y3wuikqzQZ"
                />

                <div>
                  <h4 className="font-bold text-[#dde4e1]">Sarah J.</h4>

                  <div className="flex">
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">
                      star
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#bbcac6] italic">
                "Communication was lightning fast. Picked up the Mavic 3 Pro for
                a commercial shoot in the city. Marcus gave me a quick rundown
                of the Cine features which was super helpful."
              </p>
            </div>
          </div>
        </section>
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