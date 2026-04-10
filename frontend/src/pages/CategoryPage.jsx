import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import HeaderDesktop from '../components/layouts/header/HeaderDesktop'
import FooterDesktop from '../components/layouts/footer/FooterDesktop'
import ProductsSection from '../components/home/ProductsSection'
import BtnBack from '../components/elementos/BtnBack'
import BtnOrder from '../components/elementos/BtnOrder'
import { getCategories } from '../services/categories'
import { getObjects } from '../services/objects'

function CategoryPage() {
  const { slug } = useParams()

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orderBy, setOrderBy] = useState('recent')

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getCategories()
        const rawCategories = response.data || response || []
        setCategories(Array.isArray(rawCategories) ? rawCategories : [])
      } catch (error) {
        console.error('Error cargando categorías:', error)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    async function loadObjects() {
      try {
        const objects = await getObjects()
        setProducts(Array.isArray(objects) ? objects : [])
      } catch (error) {
        console.error('Error cargando objetos:', error)
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    loadCategories()
    loadObjects()
  }, [])

  const currentCategory = useMemo(() => {
    return categories.find((category) => category.slug === slug) || null
  }, [categories, slug])

  const filteredProducts = useMemo(() => {
    if (!currentCategory) return []

    return products.filter(
      (product) => product.categoria?.id === currentCategory.id
    )
  }, [products, currentCategory])

  const orderedProducts = [...filteredProducts].sort((a, b) => {
    if (orderBy === 'recent') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    }

    if (orderBy === 'oldest') {
      return new Date(a.created_at || 0) - new Date(b.created_at || 0)
    }

    if (orderBy === 'price_asc') {
      return Number(a.preu_diari || 0) - Number(b.preu_diari || 0)
    }

    if (orderBy === 'price_desc') {
      return Number(b.preu_diari || 0) - Number(a.preu_diari || 0)
    }

    return 0
  })

  const isLoading = loadingCategories || loadingProducts
  const hasCategory = Boolean(currentCategory)
  const hasProducts = orderedProducts.length > 0

  return (
    <>
      <HeaderDesktop />

      <main className="min-h-screen bg-vecilend-dark-bg px-6 py-10 text-vecilend-dark-text">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex items-center justify-between gap-4">
            <BtnBack />
            <BtnOrder value={orderBy} onChange={setOrderBy} />
          </div>

          {isLoading ? (
            <p className="py-10 text-center text-vecilend-dark-text">
              Cargando categoría...
            </p>
          ) : !hasCategory ? (
            <section className="py-12 text-center">
              <h1 className="font-heading text-h2-desktop font-bold text-vecilend-dark-text">
                Categoría no encontrada
              </h1>

              <p className="mt-3 font-body text-body text-vecilend-dark-text-secondary">
                No existe ninguna categoría con el slug “{slug}”.
              </p>
            </section>
          ) : (
            <>
              <section className="mb-8 mt-6">
                <h1 className="font-heading text-h1-mobile font-bold text-vecilend-dark-text">
                  {currentCategory.nom}
                </h1>

                <p className="mt-2 font-body text-body-base text-vecilend-dark-text-secondary">
                  Se han encontrado {orderedProducts.length} productos en esta categoría.
                </p>
              </section>

              {hasProducts ? (
                <ProductsSection
                  title={`Productos de ${currentCategory.nom}`}
                  products={orderedProducts}
                />
              ) : (
                <section className="rounded-[20px] border border-vecilend-dark-border bg-vecilend-dark-card p-10 text-center">
                  <h2 className="font-heading text-h3-desktop text-vecilend-dark-text">
                    No hay productos en esta categoría
                  </h2>

                  <p className="mt-3 font-body text-body text-vecilend-dark-text-secondary">
                    Todavía no hay productos publicados en “{currentCategory.nom}”.
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <FooterDesktop />
    </>
  )
}

export default CategoryPage