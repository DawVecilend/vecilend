import { useEffect, useState } from 'react'
import ProductsSection from '../components/home/ProductsSection'
import { getObjects } from '../services/objects'
import BtnOrder from '../components/elementos/BtnOrder'
import BtnBack from '../components/elementos/BtnBack'

function ObjectsPage() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orderBy, setOrderBy] = useState('recent')

  useEffect(() => {
    async function loadObjects() {
      setLoadingProducts(true)
      try {
        const rawObjects = await getObjects({ sort: orderBy })
        setProducts(rawObjects)
      } catch (error) {
        console.error('Error cargando objetos:', error)
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    loadObjects()
  }, [orderBy])

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
        <ProductsSection title="Todos los Productos" products={products} />
      )}
    </>
  )
}

export default ObjectsPage