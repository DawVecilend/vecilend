import { useEffect, useState } from 'react'
import ProductsSection from '../components/home/ProductsSection'
import Header from '../components/layouts/header/HeaderDesktop'
import Footer from '../components/layouts/footer/FooterDesktop'
import { getObjects } from '../services/objects'
import { mapObjectsToProducts } from '../mappers/objectMapper'

function HomePage() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

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


  return (
    <>
      <Header />
        
      {loadingProducts ? (
        <p className="py-10 text-center text-vecilend-dark-text">
          Cargando productos...
        </p>
      ) : (
        <>
          <ProductsSection title="Todos los Productos" products={products} />
        </>
      )}

      <Footer />
    </>
  )
}

export default HomePage