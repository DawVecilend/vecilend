import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductsSection from '../components/home/ProductsSection'
import Header from '../components/layouts/header/HeaderDesktop'
import Footer from '../components/layouts/footer/FooterDesktop'
import BtnOrder from '../components/elementos/BtnOrder'
import BtnBack from '../components/elementos/BtnBack'
import { getObjects } from '../services/objects'
import { mapObjectsToProducts } from '../mappers/objectMapper'

function ResultsPage() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orderBy, setOrderBy] = useState('recent')
  const [searchParams] = useSearchParams()

  const searchText = searchParams.get('search') || ''

  useEffect(() => {
    async function loadResults() {
      setLoadingProducts(true)
      try {
        const rawObjects = await getObjects({
          search: searchText,
          sort: orderBy,
        })
        setProducts(mapObjectsToProducts(rawObjects))
      } catch (error) {
        console.error('Error cargando resultados:', error)
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    loadResults()
  }, [searchText, orderBy])

  const hasResults = products.length > 0

  return (
    <>
      <Header />

      <section className="mx-auto w-full max-w-[1380px] px-10 pt-6">
        <div className="flex items-center justify-between gap-4">
          <BtnBack />
          <BtnOrder value={orderBy} onChange={setOrderBy} />
        </div>

        <div className="mt-6">
          <h1 className="font-heading text-h2-desktop text-vecilend-dark-text">
            Resultados de búsqueda para "{searchText}"
          </h1>
          <p className="mt-2 font-body text-body text-vecilend-dark-text-secondary">
            Se han encontrado {products.length} resultados
          </p>
        </div>
      </section>

      {loadingProducts ? (
        <p className="py-10 text-center text-vecilend-dark-text">
          Cargando productos...
        </p>
      ) : hasResults ? (
        <ProductsSection title="Resultados" products={products} />
      ) : (
        <section className="mx-auto w-full max-w-[1380px] px-10 py-12">
          <div className="rounded-[20px] border border-vecilend-dark-border bg-vecilend-dark-card p-10 text-center">
            <h2 className="font-heading text-h3-desktop text-vecilend-dark-text">
              No se han encontrado resultados
            </h2>
            <p className="mt-3 font-body text-body text-vecilend-dark-text-secondary">
              No hemos encontrado objetos para "{searchText}". Prueba con otro
              término más general o revisa la ortografía.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}

export default ResultsPage