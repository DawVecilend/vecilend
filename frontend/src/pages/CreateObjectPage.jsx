import { useState } from 'react'
import BtnBack from '../components/elementos/BtnBack'

function CreateObjectPage() {
  const [form, setForm] = useState({
    name: '',
    pricePerDay: '',
    description: '',
    category: '',
  })

  const [images, setImages] = useState([])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || [])
    setImages(files)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log('Formulario:', form)
    console.log('Imágenes:', images)
  }

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
                <label
                  htmlFor="images"
                  className="mb-4 flex h-[132px] w-[132px] cursor-pointer items-center justify-center rounded-[20px] bg-[#16181C] transition-colors hover:bg-[#1B1E24]"
                >
                  <img
                    src="/assets/icons/add-object-icon.svg"
                    alt="Añadir imágenes"
                    className="h-10 w-10"
                  />
                </label>

                <p className="mb-6 font-body text-[16px] text-[#F2F4F8]">
                  Sube una o más imágenes
                </p>

                <label
                  htmlFor="images"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[14px] bg-[#14B8A6] px-6 py-3 font-body text-[15px] font-medium text-white transition-all hover:bg-[#0F766E]"
                >
                  <img
                    src="/assets/icons/camera-icon.svg"
                    alt=""
                    className="h-5 w-5"
                  />
                  Subir imagen
                </label>

                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="hidden"
                />

                {images.length > 0 && (
                  <p className="mt-4 text-sm text-[#B6BCC8]">
                    {images.length} imagen{images.length > 1 ? 'es seleccionadas' : ' seleccionada'}
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

                <div className="flex h-[56px] items-center gap-3 rounded-[16px] bg-[#101217] px-4">
                  <img
                    src="/assets/icons/box-icon.svg"
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
              </div>

              <div>
                <label
                  htmlFor="pricePerDay"
                  className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]"
                >
                  Precio (por día)
                </label>

                <div className="flex h-[56px] items-center gap-3 rounded-[16px] bg-[#101217] px-4">
                  <span className="text-[28px] leading-none text-[#6E7480]">€</span>
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
                  className="w-full rounded-[16px] bg-[#101217] px-4 py-4 font-body text-[16px] text-white placeholder:text-[#6E7480] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-3 block font-heading text-[20px] font-semibold text-[#F2F4F8]"
                >
                  Categoria
                </label>

                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="h-[56px] w-full appearance-none rounded-[16px] bg-[#101217] px-4 pr-12 font-body text-[16px] text-white focus:outline-none"
                  >
                    <option value="" disabled>
                      Seleccione una categoria
                    </option>
                    <option value="herramientas">Herramientas</option>
                    <option value="deporte">Deporte</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="hogar">Hogar</option>
                    <option value="eventos">Eventos</option>
                  </select>

                  <img
                    src="/assets/icons/chevron-down-icon.svg"
                    alt=""
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-70"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-[14px] bg-[#14B8A6] px-8 py-3 font-body text-[15px] font-semibold text-white transition-all hover:bg-[#0F766E]"
              >
                Publicar producto
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default CreateObjectPage