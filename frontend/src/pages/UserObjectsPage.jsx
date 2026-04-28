import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getUserObjects } from '../services/profile';
import HeaderDesktop from '../components/layouts/header/HeaderDesktop';
import ProductsSection from '../components/home/ProductsSection';
import BtnOrder from '../components/elementos/BtnOrder';
import BtnBack from '../components/elementos/BtnBack';


function UserObjectsPage() {

    const { user } = useContext(AuthContext);
    const { username } = useParams();
    const [objects, setObjects] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [orderBy, setOrderBy] = useState('recent');

    useEffect(() => {
        async function loadObjects() {
            setLoadingProducts(true);
            try {
                const response = await getUserObjects(username);
                console.log("📦 Objetos obtenidos de la API:", response);
                setObjects(response);
                setLoadingProducts(false);
            } catch (error) {
                console.error('Error cargando objetos:', error);
                setLoadingProducts(false);
                setObjects([]);
            }
        }

        if (username) {
            loadObjects();
        }
    }, [username]);

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
                <ProductsSection title={`Todos los productos de ${username}`} products={objects} profile={true} />
            )}x
        </>
    );
}

export default UserObjectsPage;