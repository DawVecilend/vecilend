import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BtnBack from "../components/elementos/BtnBack";
import { getCategories } from "../services/categories";
import { getProduct, updateObject } from "../services/objects";
import { mapCategories } from "../mappers/categoryMapper";
import { cldTransform } from "../utils/cloudinary";
import ObjectLocationPicker from "../components/map/ObjectLocationPicker";

function EditObjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const categoryDropdownRef = useRef(null);
  const subcategoryDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    pricePerDay: "",
    description: "",
    category: "",
    subcategory: "",
    status: "disponible",
    tipus: "lloguer",
  });

  // Ubicació de l'objecte: { lat, lng } | null
  const [location, setLocation] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [openCategories, setOpenCategories] = useState(false);
  const [openSubcategories, setOpenSubcategories] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    pricePerDay: "",
    description: "",
    category: "",
    subcategory: "",
    images: "",
    location: "",
  });

  // ── Carregar producte i categories ──
  useEffect(() => {
    async function loadData() {
      setLoadingPage(true);
      setLoadingCategories(true);

      try {
        const [product, rawCategories] = await Promise.all([
          getProduct(id),
          getCategories(),
        ]);

        setCategories(mapCategories(rawCategories));

        setForm({
          name: product.nom || "",
          pricePerDay:
            product.preu_diari !== null && product.preu_diari !== undefined
              ? String(product.preu_diari)
              : "",
          description: product.descripcio || "",
          category: product.categoria?.id ? String(product.categoria.id) : "",
          subcategory: product.subcategoria?.id
            ? String(product.subcategoria.id)
            : "",
          status: product.estat || "disponible",
          tipus: product.tipus || "lloguer",
        });

        // Si el backend retorna ubicacio com a {lat, lng}, ho posem.
        if (product.ubicacio?.lat != null && product.ubicacio?.lng != null) {
          setLocation({
            lat: Number(product.ubicacio.lat),
            lng: Number(product.ubicacio.lng),
          });
        }

        setExistingImages(product.imatges || []);
      } catch (error) {
        console.error("Error cargando producto:", error);
        setErrorMessage("No se ha podido cargar el producto");
      } finally {
        setLoadingPage(false);
        setLoadingCategories(false);
      }
    }
    loadData();
  }, [id]);

  // ── Tancar dropdowns en clicar fora ──
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setOpenCategories(false);
      }
      if (
        subcategoryDropdownRef.current &&
        !subcategoryDropdownRef.current.contains(event.target)
      ) {
        setOpenSubcategories(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategory =
    categories.find(
      (category) => String(category.id) === String(form.category),
    ) || null;

  const selectedSubcategory =
    selectedCategory?.subcategories.find(
      (subcategory) => String(subcategory.id) === String(form.subcategory),
    ) || null;

  const activeExistingImages = existingImages.filter(
    (image) => !imagesToDelete.includes(image.id),
  );
  const totalImages = activeExistingImages.length + newImages.length;

  const validateField = (
    name,
    value,
    currentTotalImages = totalImages,
    currentLocation = location,
  ) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3)
          return "El nombre debe tener al menos 3 caracteres";
        return "";

      case "pricePerDay":
        if (form.tipus === "prestec") return "";
        if (value === "") return "El precio por día es obligatorio";
        if (Number(value) < 1) return "El precio mínimo es 1,00€";
        if (Number(value) > 9999.99) return "El precio máximo es 9.999,99€";
        return "";

      case "description":
        if (!value.trim()) return "La descripción es obligatoria";
        if (value.trim().length < 10)
          return "La descripción debe tener al menos 10 caracteres";
        return "";

      case "category":
        if (!value) return "Debes seleccionar una categoría";
        return "";

      case "subcategory":
        if (!value) return "Debes seleccionar una subcategoría";
        return "";

      case "images":
        if (currentTotalImages <= 0)
          return "El producto debe tener al menos una imagen";
        return "";

      case "location":
        if (!currentLocation)
          return "Debes seleccionar la ubicación del objeto";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", form.name),
      pricePerDay:
        form.tipus === "lloguer"
          ? validateField("pricePerDay", form.pricePerDay)
          : "",
      description: validateField("description", form.description),
      category: validateField("category", form.category),
      subcategory: validateField("subcategory", form.subcategory),
      images: validateField("images", "", totalImages),
      location: validateField("location", "", totalImages, location),
    };
    setFieldErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
    setErrorMessage("");
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setFieldErrors((prev) => ({
      ...prev,
      location: validateField("location", "", totalImages, newLocation),
    }));
    setErrorMessage("");
  };

  const handleSelectCategory = (categoryId) => {
    const categoryValue = String(categoryId);
    setForm((prev) => ({
      ...prev,
      category: categoryValue,
      // Reset de subcategoria en canviar categoria
      subcategory: "",
    }));
    setFieldErrors((prev) => ({
      ...prev,
      category: validateField("category", categoryValue),
      subcategory: "",
    }));
    setErrorMessage("");
    setOpenCategories(false);
  };

  const handleSelectSubcategory = (subcategoryId) => {
    const subcategoryValue = String(subcategoryId);
    setForm((prev) => ({ ...prev, subcategory: subcategoryValue }));
    setFieldErrors((prev) => ({
      ...prev,
      subcategory: validateField("subcategory", subcategoryValue),
    }));
    setErrorMessage("");
    setOpenSubcategories(false);
  };

  const handleNewImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setNewImages((prevImages) => {
      const mergedImages = [...prevImages, ...files];
      const uniqueImages = mergedImages.filter((image, index, array) => {
        return (
          index ===
          array.findIndex(
            (item) =>
              item.name === image.name &&
              item.size === image.size &&
              item.lastModified === image.lastModified,
          )
        );
      });
      const nextTotalImages = activeExistingImages.length + uniqueImages.length;
      setFieldErrors((prev) => ({
        ...prev,
        images: validateField("images", "", nextTotalImages),
      }));
      return uniqueImages;
    });
    setErrorMessage("");
    event.target.value = "";
  };

  const handleRemoveNewImage = (imageToRemove) => {
    setNewImages((prevImages) => {
      const updatedImages = prevImages.filter(
        (image) =>
          !(
            image.name === imageToRemove.name &&
            image.size === imageToRemove.size &&
            image.lastModified === imageToRemove.lastModified
          ),
      );
      const nextTotalImages =
        activeExistingImages.length + updatedImages.length;
      setFieldErrors((prev) => ({
        ...prev,
        images: validateField("images", "", nextTotalImages),
      }));
      return updatedImages;
    });
    setErrorMessage("");
  };

  const handleRemoveExistingImage = (imageId) => {
    setImagesToDelete((prev) => {
      const updatedImagesToDelete = prev.includes(imageId)
        ? prev
        : [...prev, imageId];
      const nextExistingImages = existingImages.filter(
        (image) => !updatedImagesToDelete.includes(image.id),
      );
      const nextTotalImages = nextExistingImages.length + newImages.length;
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        images: validateField("images", "", nextTotalImages),
      }));
      return updatedImagesToDelete;
    });
    setErrorMessage("");
  };

  const getExistingImageUrl = (image) => {
    const imageUrl = image.url || image.url_cloudinary || image.imatge || "";
    return cldTransform(imageUrl, "card") || imageUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Revisa los campos marcados antes de guardar");
      return;
    }

    setLoadingSubmit(true);

    try {
      const formData = new FormData();
      formData.append("nom", form.name);
      formData.append("descripcio", form.description);
      formData.append("categoria_id", form.category);
      formData.append("subcategoria_id", form.subcategory);
      formData.append("tipus", form.tipus);
      formData.append("estat", form.status);

      if (form.tipus === "lloguer") {
        formData.append("preu_diari", form.pricePerDay);
      } else {
        formData.append("preu_diari", "");
      }

      if (location) {
        formData.append("lat", String(location.lat));
        formData.append("lng", String(location.lng));
      }

      imagesToDelete.forEach((imageId) => {
        formData.append("imatges_eliminar[]", imageId);
      });
      newImages.forEach((image) => {
        formData.append("imatges_noves[]", image);
      });

      await updateObject(id, formData);

      setSuccessMessage("Producto actualizado correctamente");
      setErrorMessage("");
      setTimeout(() => navigate(`/objects/${id}`), 1000);
    } catch (error) {
      console.error("Error actualizando producto:", error);
      if (error.response?.status === 422 && error.response.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        setErrorMessage(validationErrors[firstErrorKey][0]);
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "No se ha podido actualizar el producto",
        );
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingPage) {
    return (
      <>
        <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-4 px-10 pt-6">
          <BtnBack />
          <h1 className="font-heading text-[28px] font-semibold text-[#F2F4F8] md:text-[32px]">
            Editar producto
          </h1>
          <div className="w-[90px]" />
        </div>
        <section className="min-h-screen bg-[#0A0A0B] px-4 pb-16 pt-6 text-[#F2F4F8] md:px-6">
          <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-[#1D222A] bg-[#101217] p-8">
            <p className="text-[#B6BCC8]">Cargando producto...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-4 px-10 pt-6">
        <BtnBack />
        <h1 className="font-heading text-[28px] font-semibold text-[#F2F4F8] md:text-[32px]">
          Editar producto
        </h1>
        <div className="w-[90px]" />
      </div>

      <section className="min-h-screen bg-[#0A0A0B] px-4 pb-16 pt-6 text-[#F2F4F8] md:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* ── Imatges ── */}
            <div className="rounded-[24px] border border-dashed border-[#1D222A] bg-[#050608] px-6 py-10 md:px-10 md:py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="mb-6 font-body text-[16px] text-[#F2F4F8]">
                  Imágenes del producto
                </p>

                <div className="flex w-full flex-wrap items-center justify-center gap-4">
                  {activeExistingImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={getExistingImageUrl(image)}
                        alt={form.name}
                        className="h-[132px] w-[132px] rounded-[20px] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(image.id)}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#121214] text-white shadow-md transition hover:bg-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {newImages.map((image, index) => (
                    <div
                      key={`${image.name}-${image.size}-${image.lastModified}-${index}`}
                      className="relative"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="h-[132px] w-[132px] rounded-[20px] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(image)}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#121214] text-white shadow-md transition hover:bg-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[132px] w-[132px] items-center justify-center rounded-[20px] bg-[#16181C] transition-colors hover:bg-[#1B1E24]"
                  >
                    <img
                      src="/assets/icons/add-object-icon.svg"
                      alt="Añadir imágenes"
                      className="h-10 w-10"
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-[14px] bg-[#14B8A6] px-6 py-3 font-body text-[15px] font-medium text-white transition-all hover:bg-[#0F766E]"
                >
                  <img
                    src="/assets/icons/add-photo-icon.svg"
                    alt=""
                    className="h-5 w-5"
                  />
                  Añadir imagen
                </button>

                <input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImagesChange}
                  className="hidden"
                />

                <p className="mt-4 text-sm text-[#B6BCC8]">
                  {totalImages} imagen
                  {totalImages !== 1 ? "es actuales" : " actual"}
                </p>

                {fieldErrors.images && (
                  <p className="mt-3 text-sm text-[#ef4444]">
                    {fieldErrors.images}
                  </p>
                )}
              </div>
            </div>

            {/* ── Tipus: préstec o lloguer ── */}
            <div>
              <label className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]">
                Tipo de publicación
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, tipus: "lloguer" }))}
                  className={`flex items-center justify-center gap-2 h-[56px] rounded-[16px] font-body text-[15px] font-semibold transition ${
                    form.tipus === "lloguer"
                      ? "bg-[#14B8A6] text-white"
                      : "bg-[#101217] text-[#F2F4F8] hover:bg-[#161a21]"
                  }`}
                >
                  <span className="material-symbols-outlined">payments</span>
                  Alquiler
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      tipus: "prestec",
                      pricePerDay: "",
                    }))
                  }
                  className={`flex items-center justify-center gap-2 h-[56px] rounded-[16px] font-body text-[15px] font-semibold transition ${
                    form.tipus === "prestec"
                      ? "bg-[#14B8A6] text-white"
                      : "bg-[#101217] text-[#F2F4F8] hover:bg-[#161a21]"
                  }`}
                >
                  <span className="material-symbols-outlined">
                    volunteer_activism
                  </span>
                  Préstamo gratuito
                </button>
              </div>
              <p className="mt-2 text-xs text-[#6E7480]">
                {form.tipus === "lloguer"
                  ? "Cobrarás un precio por día por el uso del objeto."
                  : "Prestarás el objeto sin coste para la persona que lo solicite."}
              </p>
            </div>

            {/* ── Nombre ── */}
            <div>
              <label
                htmlFor="name"
                className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]"
              >
                Nombre del producto
              </label>
              <div
                className={`flex h-[56px] items-center gap-3 rounded-[16px] bg-[#101217] px-4 ${
                  fieldErrors.name ? "border border-[#ef4444]" : ""
                }`}
              >
                <img
                  src="/assets/icons/label-icon.svg"
                  alt=""
                  className="h-5 w-5 opacity-60"
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Introducir el nombre del producto"
                  className="h-full w-full bg-transparent font-body text-[16px] text-white placeholder:text-[#6E7480] focus:outline-none"
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-2 text-sm text-[#ef4444]">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* ── Precio (només lloguer) ── */}
            {form.tipus === "lloguer" && (
              <div>
                <label
                  htmlFor="pricePerDay"
                  className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]"
                >
                  Precio (por día)
                </label>
                <div
                  className={`flex h-[56px] items-center gap-3 rounded-[16px] bg-[#101217] px-4 ${
                    fieldErrors.pricePerDay ? "border border-[#ef4444]" : ""
                  }`}
                >
                  <span className="text-[28px] leading-none text-[#6E7480]">
                    €
                  </span>
                  <input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.pricePerDay}
                    onChange={handleChange}
                    placeholder="Mínimo 1,00€"
                    className="h-full w-full bg-transparent font-body text-[16px] text-white placeholder:text-[#6E7480] focus:outline-none"
                  />
                </div>
                {fieldErrors.pricePerDay && (
                  <p className="mt-2 text-sm text-[#ef4444]">
                    {fieldErrors.pricePerDay}
                  </p>
                )}
              </div>
            )}

            {/* ── Descripción ── */}
            <div>
              <label
                htmlFor="description"
                className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe los detalles y características del producto"
                className={`w-full rounded-[16px] bg-[#101217] px-4 py-4 font-body text-[16px] text-white placeholder:text-[#6E7480] focus:outline-none ${
                  fieldErrors.description ? "border border-[#ef4444]" : ""
                }`}
              />
              {fieldErrors.description && (
                <p className="mt-2 text-sm text-[#ef4444]">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* ── Categoria + Subcategoria ── */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]">
                  Categoría
                </label>
                <div ref={categoryDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenCategories(!openCategories)}
                    disabled={loadingCategories}
                    className={`inline-flex h-[56px] w-full items-center justify-between gap-3 rounded-[16px] bg-[#101217] px-4 font-body text-[16px] text-white transition hover:bg-[#161a21] disabled:cursor-not-allowed disabled:opacity-70 ${
                      fieldErrors.category ? "border border-[#ef4444]" : ""
                    }`}
                  >
                    {loadingCategories ? (
                      <span className="inline-flex items-center gap-2 text-[#6E7480]">
                        <span className="inline-block w-4 h-4 border-2 border-[#6E7480] border-t-transparent rounded-full animate-spin" />
                        Cargando categorías…
                      </span>
                    ) : (
                      <span
                        className={
                          selectedCategory ? "text-white" : "text-[#6E7480]"
                        }
                      >
                        {selectedCategory
                          ? selectedCategory.name
                          : "Seleccione una categoría"}
                      </span>
                    )}
                    <svg
                      className={`transition-transform duration-300 ${
                        openCategories ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {openCategories && !loadingCategories && (
                    <div className="absolute right-0 z-20 mt-2 max-h-[260px] w-full overflow-y-auto rounded-[16px] border border-[#2A2B31] bg-[#101217] shadow-lg">
                      {categories.map((category) => {
                        const isActive =
                          String(category.id) === String(form.category);
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleSelectCategory(category.id)}
                            className={`flex w-full items-center px-4 py-3 text-left font-body text-[15px] transition ${
                              isActive
                                ? "bg-[#0F766E]/20 text-[#14B8A6]"
                                : "text-[#F2F4F8] hover:bg-[#16181C]"
                            }`}
                          >
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {fieldErrors.category && (
                  <p className="mt-2 text-sm text-[#ef4444]">
                    {fieldErrors.category}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]">
                  Subcategoría
                </label>
                <div ref={subcategoryDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenSubcategories(!openSubcategories)}
                    disabled={loadingCategories || !selectedCategory}
                    className={`inline-flex h-[56px] w-full items-center justify-between gap-3 rounded-[16px] bg-[#101217] px-4 font-body text-[16px] text-white transition hover:bg-[#161a21] disabled:cursor-not-allowed disabled:opacity-70 ${
                      fieldErrors.subcategory ? "border border-[#ef4444]" : ""
                    }`}
                  >
                    {loadingCategories ? (
                      <span className="inline-flex items-center gap-2 text-[#6E7480]">
                        <span className="inline-block w-4 h-4 border-2 border-[#6E7480] border-t-transparent rounded-full animate-spin" />
                        Cargando subcategorías…
                      </span>
                    ) : (
                      <span
                        className={
                          selectedSubcategory ? "text-white" : "text-[#6E7480]"
                        }
                      >
                        {selectedSubcategory
                          ? selectedSubcategory.nom
                          : selectedCategory
                            ? "Seleccione una subcategoría"
                            : "Selecciona antes una categoría"}
                      </span>
                    )}
                    <svg
                      className={`transition-transform duration-300 ${
                        openSubcategories ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {openSubcategories && !loadingCategories && (
                    <div className="absolute right-0 z-20 mt-2 max-h-[260px] w-full overflow-y-auto rounded-[16px] border border-[#2A2B31] bg-[#101217] shadow-lg">
                      {(selectedCategory?.subcategories || []).map(
                        (subcategory) => {
                          const isActive =
                            String(subcategory.id) === String(form.subcategory);
                          return (
                            <button
                              key={subcategory.id}
                              type="button"
                              onClick={() =>
                                handleSelectSubcategory(subcategory.id)
                              }
                              className={`flex w-full items-center px-4 py-3 text-left font-body text-[15px] transition ${
                                isActive
                                  ? "bg-[#0F766E]/20 text-[#14B8A6]"
                                  : "text-[#F2F4F8] hover:bg-[#16181C]"
                              }`}
                            >
                              {subcategory.nom}
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.subcategory && (
                  <p className="mt-2 text-sm text-[#ef4444]">
                    {fieldErrors.subcategory}
                  </p>
                )}
              </div>
            </div>

            {/* ── Estado ── */}
            <div>
              <label
                htmlFor="status"
                className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]"
              >
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="h-[56px] w-full rounded-[16px] bg-[#101217] px-4 font-body text-[16px] text-white focus:outline-none"
              >
                <option value="disponible">Disponible</option>
                <option value="no_disponible">No disponible</option>
              </select>
            </div>

            {/* ── Ubicación ── */}
            <div>
              <label className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]">
                Ubicación del objeto
              </label>
              <p className="mb-3 text-xs text-[#6E7480]">
                Puedes ajustar la ubicación pulsando en el mapa o arrastrando el
                marcador.
              </p>
              <ObjectLocationPicker
                value={location}
                onChange={handleLocationChange}
              />
              {fieldErrors.location && (
                <p className="mt-2 text-sm text-[#ef4444]">
                  {fieldErrors.location}
                </p>
              )}
            </div>

            {/* ── Submit + alertes ── */}
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/objects/${id}`)}
                  className="rounded-[14px] border border-[#2A2B31] px-8 py-3 font-body text-[15px] font-semibold text-[#F2F4F8] transition-all hover:bg-[#16181C]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="rounded-[14px] bg-[#14B8A6] px-8 py-3 font-body text-[15px] font-semibold text-white transition-all hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingSubmit ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>

              <div className="flex items-center">
                {successMessage && (
                  <div className="flex w-fit items-center gap-2 rounded-lg border border-[#4fdbc8]/50 bg-[#4fdbc8]/10 px-4 py-2 text-[#4fdbc8] animate-pulse">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      {successMessage}
                    </p>
                  </div>
                )}
                {errorMessage && (
                  <div className="flex w-fit items-center gap-2 rounded-lg border border-[#ef4444]/50 bg-[#ef4444]/10 px-4 py-2 text-[#ef4444] animate-pulse">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default EditObjectPage;
