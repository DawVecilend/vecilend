import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BtnBack from "../components/elementos/BtnBack";
import { getCategories } from "../services/categories";
import { createObject } from "../services/objects";
import { mapCategories } from "../mappers/categoryMapper";

function CreateObjectPage() {
  const navigate = useNavigate();
  const categoryDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    pricePerDay: "",
    description: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    pricePerDay: "",
    description: "",
    category: "",
    images: "",
  });

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);

      try {
        const rawCategories = await getCategories();
        const mappedCategories = mapCategories(rawCategories);
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setOpenCategories(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCategory =
    categories.find(
      (category) => String(category.id) === String(form.category),
    ) || null;

  const validateField = (name, value, currentImages = images) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3)
          return "El nombre debe tener al menos 3 caracteres";
        return "";

      case "pricePerDay":
        if (value === "") return "El precio por día es obligatorio";
        if (Number(value) <= 0) return "El precio debe ser mayor que 0";
        return "";

      case "description":
        if (!value.trim()) return "La descripción es obligatoria";
        if (value.trim().length < 10)
          return "La descripción debe tener al menos 10 caracteres";
        return "";

      case "category":
        if (!value) return "Debes seleccionar una categoría";
        return "";

      case "images":
        if (!currentImages.length) return "Debes subir al menos una imagen";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", form.name),
      pricePerDay: validateField("pricePerDay", form.pricePerDay),
      description: validateField("description", form.description),
      category: validateField("category", form.category),
      images: validateField("images", "", images),
    };

    setFieldErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    setErrorMessage("");
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || []);

    setImages((prevImages) => {
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

      setFieldErrors((prev) => ({
        ...prev,
        images: validateField("images", "", uniqueImages),
      }));

      return uniqueImages;
    });

    setErrorMessage("");
    event.target.value = "";
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter(
        (image) =>
          !(
            image.name === imageToRemove.name &&
            image.size === imageToRemove.size &&
            image.lastModified === imageToRemove.lastModified
          ),
      );

      setFieldErrors((prev) => ({
        ...prev,
        images: validateField("images", "", updatedImages),
      }));

      return updatedImages;
    });

    setErrorMessage("");
  };

  const handleSelectCategory = (categoryId) => {
    const categoryValue = String(categoryId);

    setForm((prev) => ({
      ...prev,
      category: categoryValue,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      category: validateField("category", categoryValue),
    }));

    setErrorMessage("");
    setOpenCategories(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const isValid = validateForm();

    if (!isValid) {
      setErrorMessage("Revisa los campos marcados antes de publicar");
      return;
    }

    setLoadingSubmit(true);

    try {
      const formData = new FormData();

      formData.append("nom", form.name);
      formData.append("preu_diari", form.pricePerDay);
      formData.append("descripcio", form.description);
      formData.append("categoria_id", form.category);
      formData.append("tipus", "lloguer");
      formData.append("lat", "41.3140");
      formData.append("lng", "2.0143");

      images.forEach((image) => {
        formData.append("imatges[]", image);
      });

      await createObject(formData);

      setSuccessMessage("¡Producto publicado correctamente!");
      setErrorMessage("");

      setTimeout(() => {
        navigate("/objects");
      }, 1200);
    } catch (error) {
      console.error("Error creando producto:", error);

      if (error.response?.status === 422 && error.response.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        setErrorMessage(validationErrors[firstErrorKey][0]);
      } else {
        setErrorMessage(
          error.response?.data?.message || "No se ha podido crear el producto",
        );
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-4 px-10 pt-6">
        <BtnBack />
        <h1 className="font-heading text-[28px] font-semibold text-[#F2F4F8] md:text-[32px]">
          Subir producto
        </h1>
        <div className="w-[90px]" />
      </div>

      <section className="min-h-screen bg-[#0A0A0B] px-4 pb-16 pt-6 text-[#F2F4F8] md:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="rounded-[24px] border border-dashed border-[#1D222A] bg-[#050608] px-6 py-10 md:px-10 md:py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="mb-6 font-body text-[16px] text-[#F2F4F8]">
                  Sube una o más imágenes
                </p>

                <div className="flex w-full flex-wrap items-center justify-center gap-4">
                  {images.map((image, index) => (
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
                        onClick={() => handleRemoveImage(image)}
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
                  Subir imagen
                </button>

                <input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="hidden"
                />

                {images.length > 0 && (
                  <p className="mt-4 text-sm text-[#B6BCC8]">
                    {images.length} imagen
                    {images.length > 1 ? "es seleccionadas" : " seleccionada"}
                  </p>
                )}

                {fieldErrors.images && (
                  <p className="mt-3 text-sm text-[#ef4444]">
                    {fieldErrors.images}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-8">
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
                    min="0"
                    step="0.01"
                    value={form.pricePerDay}
                    onChange={handleChange}
                    placeholder="Precio por día"
                    className="h-full w-full bg-transparent font-body text-[16px] text-white placeholder:text-[#6E7480] focus:outline-none"
                  />
                </div>

                {fieldErrors.pricePerDay && (
                  <p className="mt-2 text-sm text-[#ef4444]">
                    {fieldErrors.pricePerDay}
                  </p>
                )}
              </div>

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

              <div>
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
                      className={`transition-transform duration-300 ${openCategories ? "rotate-180" : ""}`}
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
            </div>

            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="rounded-[14px] bg-[#14B8A6] px-8 py-3 font-body text-[15px] font-semibold text-white transition-all hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingSubmit ? "Publicando..." : "Publicar producto"}
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

export default CreateObjectPage;
