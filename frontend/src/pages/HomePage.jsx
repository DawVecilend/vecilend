import HeroSection from '../components/home/HeroSection'
import CategoriesSection from '../components/home/categories/CategoriesSection'
import ProductsSection from '../components/home/ProductsSection'
import products from '../data/products/products'
import Header from '../components/layouts/header/HeaderDesktop'
import Footer from '../components/layouts/footer/FooterDesktop'
import TopUsersSection from '../components/home/TopUsersSection'
import BenefitsSection from '../components/home/BenefitsSection'




function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <CategoriesSection />
      <ProductsSection title="Mejores Productos" products={products} />
      <ProductsSection title="Publicaciones Recientes" products={products} />
      <TopUsersSection />
      <BenefitsSection />
      <Footer />
    </>
  )
}

export default HomePage