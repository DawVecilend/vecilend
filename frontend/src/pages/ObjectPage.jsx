import { useEffect, useState } from 'react'
import { getProduct } from '../services/objects'
import { useParams } from 'react-router-dom'
import BtnBack from '../components/elementos/BtnBack'
import UserCard from '../components/elementos/UserCard'

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


    return (
        <>
            <div className='pt-24 flex justify-center gap-8'>
                <div className='flex flex-col w-full max-w-[700px]'>
                    <div className='flex flex-col'>
                        <div className='flex flex-col'>
                            <div >
                                <img
                                    src={mainImage}
                                    alt="Principal"
                                    className='w-[700px] h-[428px]'
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
                        <div>
                            <h2 className='text-vecilend-dark-text text-h3-desktop'>Descripción:</h2>
                            <p className='text-vecilend-dark-text text-body-base'>{product.descripcio}</p>
                        </div>
                        <div className='mt-[33px]'>
                            {product?.propietari && <UserCard user={product.propietari} />}
                        </div>
                    </div>
                </div>
                <div className='w-full max-w-[700px]'>
                    <BtnBack />
                    <p className='text-vecilend-dark-text text-text-h3-desktop'>{product.nom}</p>
                </div>
            </div>
        </>
    )
}

export default ObjectPage