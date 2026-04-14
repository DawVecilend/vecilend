import { useEffect, useState } from 'react'
import ProductsSection from '../components/home/ProductsSection'
import Header from '../components/layouts/header/HeaderDesktop'
import Footer from '../components/layouts/footer/FooterDesktop'
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
      setLoadingProducts(true)
      try {
        const rawObjects = await getObjects({ sort: orderBy })
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
  }, [orderBy])

  return (
    <>
      <Header />
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
      <Footer />
    </>
  )
}

export default ObjectsPage