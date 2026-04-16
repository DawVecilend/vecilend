import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductsSection from '../components/home/ProductsSection'
import BtnOrder from '../components/elementos/BtnOrder'
import BtnBack from '../components/elementos/BtnBack'
import { getObjects } from '../services/objects'
import { mapObjectsToProducts } from '../mappers/objectMapper'

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function getWords(text) {
  return normalizeText(text)
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
}

function matchesSearch(object, searchText) {
  const searchWords = getWords(searchText)

  if (!searchWords.length) return true

  const nameWords = getWords(object.nom)
  const categoryWords = getWords(object.categoria?.nom)
  const userWords = getWords(object.user?.nom)

  const searchableWords = [...nameWords, ...categoryWords, ...userWords]

  return searchWords.every((searchWord) =>
    searchableWords.some((word) => word.startsWith(searchWord))
  )
}

function ResultsPage() {
  const [allProducts, setAllProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orderBy, setOrderBy] = useState('recent')
  const [searchParams] = useSearchParams()

  const searchText = searchParams.get('search') || ''

  useEffect(() => {
    async function loadObjects() {
      try {
        setLoadingProducts(true)
        const response = await getObjects()
        const rawObjects = response.data || response || []
        setAllProducts(Array.isArray(rawObjects) ? rawObjects : [])
      } catch (error) {
        console.error('Error cargando resultados:', error)
        setAllProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    loadObjects()
  }, [])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((object) => matchesSearch(object, searchText))
  }, [allProducts, searchText])

  const orderedRawProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    if (orderBy === 'recent') {
      return sorted.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      )
    }

    if (orderBy === 'oldest') {
      return sorted.sort(
        (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
      )
    }

    if (orderBy === 'price_asc') {
      return sorted.sort(
        (a, b) => Number(a.preu_diari || 0) - Number(b.preu_diari || 0)
      )
    }

    if (orderBy === 'price_desc') {
      return sorted.sort(
        (a, b) => Number(b.preu_diari || 0) - Number(a.preu_diari || 0)
      )
    }

    return sorted
  }, [filteredProducts, orderBy])

  const orderedProducts = useMemo(() => {
    return mapObjectsToProducts(orderedRawProducts)
  }, [orderedRawProducts])

  const hasResults = orderedProducts.length > 0

  return (
    <>
      <section className="mx-auto w-full max-w-[1380px] px-10 pt-6">
        <div className="flex items-center justify-between gap-4">
          <BtnBack />
          <BtnOrder value={orderBy} onChange={setOrderBy} />
        </div>

        <div className="mt-6">
          <h1 className="font-heading text-h2-desktop text-vecilend-dark-text">
            Resultados de búsqueda para “{searchText}”
          </h1>

          <p className="mt-2 font-body text-body text-vecilend-dark-text-secondary">
            Se han encontrado {orderedProducts.length} resultados
          </p>
        </div>
      </section>

      {loadingProducts ? (
        <p className="py-10 text-center text-vecilend-dark-text">
          Cargando productos...
        </p>
      ) : hasResults ? (
        <ProductsSection title="Resultados" products={orderedProducts} />
      ) : (
        <section className="mx-auto w-full max-w-[1380px] px-10 py-12">
          <div className="rounded-[20px] border border-vecilend-dark-border bg-vecilend-dark-card p-10 text-center">
            <h2 className="font-heading text-h3-desktop text-vecilend-dark-text">
              No se han encontrado resultados
            </h2>

            <p className="mt-3 font-body text-body text-vecilend-dark-text-secondary">
              No hemos encontrado objetos para “{searchText}”. Prueba con otro
              término más general o revisa la ortografía.
            </p>
          </div>
        </section>
      )}
    </>
  )
}

export default ResultsPage