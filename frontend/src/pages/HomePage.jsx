import { useEffect, useState } from 'react'
import HeroSection from '../components/home/HeroSection'
import CategoriesSection from '../components/home/categories/CategoriesSection'
import ProductsSection from '../components/home/ProductsSection'
import TopUsersSection from '../components/home/TopUsersSection'
import BenefitsSection from '../components/home/BenefitsSection'
import { getObjects } from '../services/objects'
import { getCategories } from '../services/categories'
import { mapObjectsToProducts } from '../mappers/objectMapper'
import { mapCategories } from '../mappers/categoryMapper'

function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)

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

    async function loadCategories() {
      try {
        const response = await getCategories()
        const rawCategories = response.data || response || []
        const mappedCategories = mapCategories(rawCategories)
        setCategories(mappedCategories)
      } catch (error) {
        console.error('Error cargando categorías:', error)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadObjects()
    loadCategories()
  }, [])

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5)

  const topProducts = recentProducts

  return (
    <>
      <HeroSection />

      {loadingCategories ? (
        <p className="py-6 text-center text-vecilend-dark-text">
          Cargando categorías...
        </p>
      ) : (
        <CategoriesSection categories={categories} />
      )}

      {loadingProducts ? (
        <p className="py-10 text-center text-vecilend-dark-text">
          Cargando productos...
        </p>
      ) : (
        <>
          <ProductsSection title="Mejores Productos" products={topProducts} />
          <ProductsSection title="Publicaciones Recientes" products={recentProducts} />
        </>
      )}

      <TopUsersSection />
      <BenefitsSection />
    </>
  )
}

export default HomePage