import { useParams } from 'react-router-dom'
import HeaderDesktop from '../components/layouts/header/HeaderDesktop'
import FooterDesktop from '../components/layouts/footer/FooterDesktop'

function CategoryPage() {
  const { slug } = useParams()

  return (
    <>
      <HeaderDesktop />

      <main className="min-h-screen bg-vecilend-dark-bg px-6 py-16 text-vecilend-dark-text">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="mb-4 font-heading text-h1-mobile font-bold">
            Categoría: {slug}
          </h1>

          <p className="font-body text-body-base text-vecilend-dark-text-secondary">
            Página en construcción.
          </p>
        </div>
      </main>

      <FooterDesktop />
    </>
  )
}

export default CategoryPage