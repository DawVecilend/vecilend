import { useEffect, useState } from 'react'
import ProductsSection from '../components/home/ProductsSection'
import Header from '../components/layouts/header/HeaderDesktop'
import Footer from '../components/layouts/footer/FooterDesktop'
import { getObjects } from '../services/objects'
import BtnOrder from '../components/elementos/BtnOrder'
import BtnBack from '../components/elementos/BtnBack'

function ObjectsPage() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orderBy, setOrderBy] = useState('recent')

  useEffect(() => {
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

    loadObjects()
  }, [])

  const orderedProducts = [...products].sort((a, b) => {
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

    if (orderBy === 'rating') {
      return 0
    }

    return 0
  })

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
        <ProductsSection title="Todos los Productos" products={orderedProducts} />
      )}

      <Footer />
    </>
  )
}

export default ObjectsPage