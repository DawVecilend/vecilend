import { useEffect, useMemo, useState } from 'react'
import ProductsSection from '../components/home/ProductsSection'
import { getObjects } from '../services/objects'
import BtnOrder from '../components/elementos/BtnOrder'
import BtnBack from '../components/elementos/BtnBack'
import { mapObjectsToProducts } from '../mappers/objectMapper'

function ObjectsPage() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orderBy, setOrderBy] = useState('recent')

  useEffect(() => {
    async function loadObjects() {
      try {
        const response = await getObjects()
        const rawObjects = response.data || response || []
        const mappedProducts = mapObjectsToProducts(rawObjects)
        setProducts(mappedProducts)
      } catch (error) {
        console.error('Error cargando objetos:', error)
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    loadObjects()
  }, [])

  const orderedProducts = useMemo(() => {
    const sorted = [...products]

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
        (a, b) => Number(a.pricePerDay || 0) - Number(b.pricePerDay || 0)
      )
    }

    if (orderBy === 'price_desc') {
      return sorted.sort(
        (a, b) => Number(b.pricePerDay || 0) - Number(a.pricePerDay || 0)
      )
    }

    if (orderBy === 'rating') {
      return sorted.sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      )
    }

    return sorted
  }, [products, orderBy])

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-4 px-10 pt-6">
        <BtnBack />
        <BtnOrder value={orderBy} onChange={setOrderBy} />
      </div>

      {loadingProducts ? (
        <p className="py-10 text-center text-vecilend-dark-text">
          Cargando productos...
        </p>
      ) : (
        <ProductsSection title="Todos los Productos" products={orderedProducts} />
      )}
    </>
  )
}

export default ObjectsPage