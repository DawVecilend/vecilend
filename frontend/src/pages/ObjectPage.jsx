import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { getProduct, deleteObject } from "../services/objects";
import { createTransaction, getTransactions } from "../services/transactions";
import { useAuth } from "../contexts/AuthContext";
import BtnBack from "../components/elementos/BtnBack";
import UserCard from "../components/elementos/UserCard";
import DateRangeCalendar from "../components/calendar/DateRangeCalendar";
import ObjectMiniMap from "../components/map/ObjectMiniMap";
import { cldTransform } from "../utils/cloudinary";
import ConfirmDeleteModal from "../components/elementos/ConfirmDeleteModal";
import NotFoundPage from "./NotFoundPage";
import NavCategori from "../components/elementos/NavCategori";
import DetailsPriceCardProduct from "../components/elementos/DetailsPriceCard";


function ObjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState({ start: null, end: null });
  const [missatge, setMissatge] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const searchContext = useMemo(
    () => ({
      data_inici: searchParams.get("data_inici"),
      data_fi: searchParams.get("data_fi"),
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
      radius: searchParams.get("radius"),
    }),
    [searchParams],
  );

  const initialRange =
    searchContext.data_inici && searchContext.data_fi
      ? { start: searchContext.data_inici, end: searchContext.data_fi }
      : undefined;

  const searchCenter =
    searchContext.lat && searchContext.lng
      ? { lat: Number(searchContext.lat), lng: Number(searchContext.lng) }
      : null;

  const searchRadiusKm = searchContext.radius
    ? Math.round(Number(searchContext.radius) / 1000)
    : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProduct(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setMainImage(data?.imatges?.[0]?.url || null);
      })
      .catch((err) => {
        console.error("Error cargando producto:", err);
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !product) {
      setHasPendingRequest(false);
      return;
    }
    if (product.propietari?.id === user?.id) {
      setHasPendingRequest(false);
      return;
    }

    let cancelled = false;
    getTransactions({
      role: "requester",
      status: "pendent",
      objecte_id: product.id,
    })
      .then((res) => {
        if (!cancelled) {
          const rows = res?.data || [];
          setHasPendingRequest(Array.isArray(rows) && rows.length > 0);
        }
      })
      .catch((err) => {
        console.error("Error comprobando solicitudes pendientes:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, product, user?.id]);

  const dies = useMemo(() => {
    if (!range.start || !range.end) return 0;
    return range.end.diff(range.start, "day") + 1;
  }, [range]);
  
  const [total, setTotal] = useState(0);

  const preuTotal = product?.preu_diari && product.tipus === "lloguer" ? total : 0;

  const isOwnObject = !!(user && product?.propietari?.id === user.id);
  const isUnavailable = product?.estat === "no_disponible";

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    if (!range.start || !range.end) {
      setSubmitError("Selecciona las fechas para continuar.");
      return;
    }

    setSubmitting(true);
    try {
      await createTransaction({
        objecte_id: product.id,
        data_inici: range.start.format("YYYY-MM-DD"),
        data_fi: range.end.format("YYYY-MM-DD"),
        missatge: missatge.trim() || null,
      });
      setSubmitSuccess(true);
      setMissatge("");
      setRange({ start: null, end: null });
      setHasPendingRequest(true);
    } catch (err) {
      if (
        err.response?.status === 422 &&
        err.response.data?.errors?.objecte_id
      ) {
        setHasPendingRequest(true);
      }
      setSubmitError(
        err.response?.data?.message ||
          "No se ha podido enviar la solicitud. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <div
          className="h-10 w-10 rounded-full border-4 border-app-border border-t-vecilend-dark-primary animate-spin"
          role="status"
          aria-label="Cargando"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <NotFoundPage
        title="Objeto no encontrado"
        message="El objeto que buscas no existe o ha sido eliminado."
      />
    );
  }

  const propietari = product.propietari;
  const images = product.imatges?.map((img) => img.url) || [];

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteObject(product.id);
      navigate("/objects");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "No se ha podido eliminar el producto. Inténtalo de nuevo.";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  let actionBox;
  if (isOwnObject) {
    actionBox = (
      <div className="rounded-2xl bg-app-card border border-app-border p-6 text-center">
        <span className="material-symbols-outlined text-vecilend-dark-primary text-4xl mb-2 inline-block">
          inventory_2
        </span>
        <p className="text-h3-mobile text-app-text font-heading mb-1">
          Este objeto es tuyo
        </p>
        <p className="text-label text-app-text-secondary font-body mb-4">
          Solo tú puedes editarlo o eliminarlo.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to={`/objects/${product.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full bg-vecilend-dark-primary px-5 py-2 text-label font-bold text-[#003730] active:scale-95 hover:opacity-90 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Editar
          </Link>

          <button
            type="button"
            onClick={() => {
              setDeleteError(null);
              setConfirmDeleteOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#ef4444] px-5 py-2 text-label font-bold text-[#ef4444] hover:bg-[#ef4444]/10 active:scale-95 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            Eliminar
          </button>
        </div>
      </div>
    );
  } else if (isUnavailable) {
    actionBox = (
      <div className="rounded-2xl bg-app-card border border-app-border p-6 text-center">
        <span className="material-symbols-outlined text-amber-400 text-4xl mb-2 inline-block">
          block
        </span>
        <p className="text-h3-mobile text-app-text font-heading mb-1">
          No disponible
        </p>
        <p className="text-label text-app-text-secondary font-body">
          Este objeto está prestado o el propietario lo ha pausado.
        </p>
      </div>
    );
  } else if (hasPendingRequest) {
    actionBox = (
      <div className="rounded-2xl bg-app-card border border-vecilend-dark-primary/40 p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="material-symbols-outlined text-vecilend-dark-primary text-2xl shrink-0">
            schedule
          </span>
          <div>
            <p className="text-h3-mobile text-app-text font-heading mb-1">
              Ya tienes una solicitud pendiente sobre este objeto
            </p>
            <p className="text-label text-app-text-secondary font-body">
              Espera a que el propietario responda antes de enviar otra.
            </p>
          </div>
        </div>
        <Link
          to="/transactions?role=requester&status=pendent"
          className="block w-full text-center rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] transition-transform active:scale-95"
        >
          Ver mis solicitudes enviadas
        </Link>
      </div>
    );
  } else {
    actionBox = (
      <div className="rounded-2xl bg-app-card border border-app-border p-6 flex flex-col gap-4">
        <div className="pb-4">
          {product.tipus === "lloguer" && product.preu_diari ? (
            <div className="flex flex-col">
              <DateRangeCalendar
                datesOcupades={product.dates_ocupades || []}
                initialRange={initialRange}
                onRangeChange={setRange}
              />
              <DetailsPriceCardProduct
                product={product}
                diasSelected={dies}
                onTotalChange={setTotal}
              />
            </div>
            
          ) : (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-vecilend-dark-secondary">
                volunteer_activism
              </span>
              <span className="text-h3-desktop font-bold text-vecilend-dark-secondary font-heading">
                Préstamo gratuito
              </span>
            </div>
          )}
        </div>

        {dies > 0 && product.tipus === "lloguer" && (
          <div className="flex items-center justify-between pt-3 border-t border-app-border">
            <span className="text-label text-app-text-secondary font-body">
              Total ({dies} día{dies === 1 ? "" : "s"})
            </span>
            <span className="text-h3-desktop font-bold text-vecilend-dark-primary font-body">
              {preuTotal.toFixed(2)}€
            </span>
          </div>
        )}
        {dies > 0 && product.tipus === "prestec" && (
          <div className="flex items-center justify-between pt-3 border-t border-app-border">
            <span className="text-label text-app-text-secondary font-body">
              Duración: {dies} día{dies === 1 ? "" : "s"}
            </span>
            <span className="text-label font-bold text-vecilend-dark-secondary font-body">
              Sin coste
            </span>
          </div>
        )}

        <textarea
          value={missatge}
          onChange={(e) => setMissatge(e.target.value)}
          placeholder="Mensaje al propietario (opcional)"
          rows={4}
          maxLength={1000}
          className="w-full rounded-xl bg-vecilend-dark-neutral border border-app-border p-3 text-body-base text-app-text font-body focus:outline-none focus:ring-2 focus:ring-vecilend-dark-primary"
        />

        {submitError && (
          <p className="text-label text-red-400 font-body">{submitError}</p>
        )}
        {submitSuccess && (
          <p className="text-label text-vecilend-dark-secondary font-body">
            ✓ Solicitud enviada al propietario.
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !range.start || !range.end}
          className="w-full rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] transition-transform active:scale-95 disabled:opacity-50  cursor-pointer"
        >
          {submitting ? "Enviando…" : "Enviar solicitud"}
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 md:px-10 pt-6 pb-32">
      <BtnBack />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div>
            <img
              src={
                cldTransform(mainImage, "detail") ||
                "/assets/product1-image.jpg"
              }
              alt={product.nom}
              className="w-full h-[280px] md:h-[428px] object-cover rounded-2xl"
            />
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 rounded-lg transition ${
                      mainImage === img
                        ? "ring-2 ring-vecilend-dark-primary"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Imagen ${idx + 1}`}
                  >
                    <img
                      src={cldTransform(img, "thumb")}
                      alt={`thumb-${idx}`}
                      className="w-[60px] h-[60px] cursor-pointer rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {propietari && propietari.username && (
            <Link
              to={`/profile/${propietari.username}`}
              className="block hover:opacity-90 transition"
            >
              <UserCard user={propietari} />
            </Link>
          )}
          {propietari && !propietari.username && <UserCard user={propietari} />}
          {product.ubicacio && (
            <div>
              <h2 className="text-app-text text-h3-desktop font-heading mb-3">
                {searchCenter
                  ? "Ubicación y tu zona de búsqueda"
                  : "Ubicación aproximada"}
              </h2>
              <ObjectMiniMap
                ubicacio={product.ubicacio}
                nom={product.nom}
                searchCenter={searchCenter}
                searchRadiusKm={searchRadiusKm}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          {(product.categoria || product.subcategoria) && (
            <NavCategori mainCategory={product.categoria} subCategory={product.subcategoria}/>
          )}

          {/* Títol */}
          <div className="space-y-2">
            <h1 className="text-app-text text-h1-mobile lg:text-h1-desktop font-heading">
              {product.nom}
            </h1>

            {/* Valoració específica d'aquest objecte (mitjana ponderada per temps) */}
            {product.valoracio_objecte?.avg != null &&
            product.valoracio_objecte?.total > 0 ? (
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#f38764] text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-[#f38764] font-bold">
                  {Number(product.valoracio_objecte.avg).toFixed(1)}
                </span>
                <span className="text-app-text-secondary text-label">
                  ({product.valoracio_objecte.total}{" "}
                  {product.valoracio_objecte.total === 1
                    ? "valoración "
                    : "valoraciones "}
                  para este objeto)
                </span>
              </div>
            ) : (
              <p className="text-app-text-secondary text-label italic">
                Sin valoraciones específicas para este objeto
              </p>
            )}
          </div>

          <div>
            <p className="text-app-text-secondary text-body-base font-body whitespace-pre-line">
              {product.descripcio}
            </p>
              <div className="flex items-baseline gap-2">
                <span className="text-h2-desktop font-bold text-vecilend-dark-primary font-heading">
                  {Number(product.preu_diari).toFixed(2)}€
                </span>
                <span className="text-app-text-secondary text-body-base">
                  / día
                </span>
              </div>
          </div>

          {actionBox}
        </div>
      </div>
      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => {
          if (!deleting) setConfirmDeleteOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar producto?"
        message={`Vas a eliminar "${product.nom}".`}
        description="Esta acción es permanente y borrará también todas las imágenes. Si tiene solicitudes pendientes o aceptadas, deberás resolverlas antes."
        confirmLabel="Sí, eliminar"
        busy={deleting}
        errorMessage={deleteError}
      />
    </section>
  );
}

export default ObjectPage;
