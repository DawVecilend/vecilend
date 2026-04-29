import { useEffect, useState } from 'react'
import { getProduct } from '../services/objects'
import { useParams } from 'react-router-dom'
import NavCategori from '../components/elementos/NavCategori'
import UserCard from '../components/elementos/UserCard'
import DetailsPriceCardProduct from '../components/elementos/DetailsPriceCardProduct'
import { Calendar } from 'react-aria-components'

function ObjectPage() {
  const [product, setProduct] = useState([])
  const { id } = useParams()
  const images = [
    "/assets/product1-image.jpg",
    "/assets/img-objeto.png"
  ];
  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await getProduct(id)
        console.log('Producto Cargando:', response.data)
        setProduct(response.data)
      } catch (error) {
        console.error('Error cargando producto:', error)
        setProduct(null)
      }
    }
    loadProduct()
  }, [id])


  const diasSelected = 2;

  return (
    <>
      <div className='pt-12 flex flex-col md:flex-row justify-center gap-8 pb-8'>
        <div className='flex flex-col w-full max-w-[700px]'>
          <NavCategori mainCategory={product.categoria} subCategory={"Prueba"} />
          <div className='flex flex-col'>
            <div className='flex flex-col'>
              <div className='w-max-[700px] h-[428px]'>
                <img
                  src={mainImage}
                  alt="Principal"
                  className='flex justify-center w-full h-full'
                />
              </div>
              <div className='flex justify-center gap-2 mt-2'>
                {images.length > 1 && (
                  images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`thumb-${index}`}
                      onClick={() => setMainImage(img)}
                      className='w-[60px] h-[60px] cursor-pointer'
                      style={{
                        border: mainImage === img ? "2px solid white" : "none"
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div>
            <div className='pt-4'>
              <p className='text-vecilend-dark-text text-h2-desktop'>{product.nom}</p>
              <div className='pb-4 pt-2'>
                <h2 className='text-vecilend-dark-text text-h3-desktop'>Descripción:</h2>
                <p className='text-vecilend-dark-text text-body-base'>{product.descripcio}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full max-w-[700px]'>
          <p className='text-vecilend-dark-text flex gap-2 items-center'>
            <span className='text-h2-desktop'>{product.preu_diari} / día</span>
            (El precio depende del numero de días)
          </p>
          <DetailsPriceCardProduct product={product} diasSelected={diasSelected} />
          <div className='mt-[33px]'>
            {product?.propietari && <UserCard user={product.propietari} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default ObjectPage