import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { getProduct } from "../services/objects";
import { createTransaction } from "../services/transactions";
import { useAuth } from "../contexts/AuthContext";
import BtnBack from "../components/elementos/BtnBack";
import UserCard from "../components/elementos/UserCard";
import DateRangeCalendar from "../components/calendar/DateRangeCalendar";
import ObjectMiniMap from "../components/map/ObjectMiniMap";

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

  // Context de cerca de l'URL
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

  // Càrrega del producte
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
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

  const images = product?.imatges?.map((img) => img.url) || [];

  useEffect(() => {
    if (images.length > 0 && !mainImage) setMainImage(images[0]);
  }, [images, mainImage]);

  // Càlculs derivats
  const dies = useMemo(() => {
    if (!range.start || !range.end) return 0;
    return range.end.diff(range.start, "day") + 1;
  }, [range]);

  const preuTotal = useMemo(() => {
    if (!product?.preu_diari || product.tipus !== "lloguer") return 0;
    return Number(product.preu_diari) * dies;
  }, [product, dies]);

  // Submit
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
    } catch (err) {
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
      <p className="pt-24 text-center text-vecilend-dark-text">Cargando…</p>
    );
  }

  if (!product) {
    return (
      <p className="pt-24 text-center text-vecilend-dark-text">
        No se ha encontrado el objeto.
      </p>
    );
  }

  const isOwnObject = user && product.propietari?.id === user.id;

  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 md:px-10 pt-6 pb-32">
      <BtnBack />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Esquerra ── */}
        <div className="flex flex-col gap-6">
          <div>
            <img
              src={mainImage || "/assets/product1-image.jpg"}
              alt={product.nom}
              className="w-full h-[280px] md:h-[428px] object-cover rounded-2xl"
            />
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    onClick={() => setMainImage(img)}
                    className={`w-[60px] h-[60px] cursor-pointer rounded-lg object-cover ${
                      mainImage === img
                        ? "ring-2 ring-vecilend-dark-primary"
                        : ""
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {product.propietari && <UserCard user={product.propietari} />}

          <div>
            <h2 className="text-vecilend-dark-text text-h3-desktop font-heading mb-2">
              Descripción
            </h2>
            <p className="text-vecilend-dark-text-secondary text-body-base font-body">
              {product.descripcio}
            </p>
          </div>

          {product.ubicacio && (
            <div>
              <h2 className="text-vecilend-dark-text text-h3-desktop font-heading mb-2">
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

        {/* ── Dreta ── */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-vecilend-dark-text text-h2-desktop font-heading mb-2">
              {product.nom}
            </h1>
            {product.tipus === "lloguer" && product.preu_diari && (
              <p className="text-vecilend-dark-text text-h3-desktop font-body">
                <span className="text-vecilend-dark-primary font-bold">
                  {product.preu_diari}€
                </span>
                <span className="text-vecilend-dark-text-secondary">
                  {" "}
                  / día
                </span>
                {dies > 0 && (
                  <span className="text-vecilend-dark-text-secondary text-label ml-2">
                    · {dies} día{dies === 1 ? "" : "s"}
                  </span>
                )}
              </p>
            )}
            {product.tipus === "prestec" && (
              <p className="text-vecilend-dark-secondary text-h3-desktop font-bold font-body">
                Préstamo gratuito
              </p>
            )}
          </div>

          <div>
            <h3 className="text-vecilend-dark-text text-h3-desktop font-heading mb-2">
              Selecciona las fechas
            </h3>
            <DateRangeCalendar
              datesOcupades={product.dates_ocupades || []}
              initialRange={initialRange}
              onRangeChange={setRange}
            />
          </div>

          {!isOwnObject && (
            <div className="rounded-2xl bg-vecilend-dark-card border border-vecilend-dark-border p-4 flex flex-col gap-3">
              {dies > 0 && product.tipus === "lloguer" && (
                <div className="flex items-center justify-between">
                  <span className="text-label text-vecilend-dark-text-secondary font-body">
                    Total ({dies} día{dies === 1 ? "" : "s"})
                  </span>
                  <span className="text-h3-desktop font-bold text-vecilend-dark-primary font-body">
                    {preuTotal.toFixed(2)}€
                  </span>
                </div>
              )}

              <textarea
                value={missatge}
                onChange={(e) => setMissatge(e.target.value)}
                placeholder="Mensaje al propietario (opcional)"
                rows={3}
                maxLength={1000}
                className="w-full rounded-xl bg-vecilend-dark-neutral border border-vecilend-dark-border p-3 text-body-base text-vecilend-dark-text font-body focus:outline-none focus:ring-2 focus:ring-vecilend-dark-primary"
              />

              {submitError && (
                <p className="text-label text-red-400 font-body">
                  {submitError}
                </p>
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
                className="w-full rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Enviando…" : "Enviar solicitud"}
              </button>
            </div>
          )}

          {isOwnObject && (
            <div className="rounded-2xl bg-vecilend-dark-card border border-vecilend-dark-border p-4">
              <p className="text-label text-vecilend-dark-text-secondary font-body text-center">
                Este objeto es tuyo.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ObjectPage;
