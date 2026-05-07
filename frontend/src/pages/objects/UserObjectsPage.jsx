import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserObjects } from "../../services/profile";
import ProductsSection from "../../components/home/ProductsSection";
import ProductsGridSkeleton from "../../components/elementos/ProductsGridSkeleton";
import BtnOrder from "../../components/elementos/BtnOrder";
import BtnBack from "../../components/elementos/BtnBack";

function UserObjectsPage() {
  const { user } = useContext(AuthContext);
  const { username } = useParams();

  const [objects, setObjects] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orderBy, setOrderBy] = useState("recent");

  const isOwnProfile = user && user.username === username;

  useEffect(() => {
    async function loadObjects() {
      setLoadingProducts(true);

      try {
        const response = await getUserObjects(username);
        setObjects(response);
      } catch (error) {
        console.error("Error cargando objetos:", error);
        setObjects([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    if (username) loadObjects();
  }, [username]);

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-4 px-10 pt-6">
        <BtnBack />
        <BtnOrder value={orderBy} onChange={setOrderBy} />
      </div>

      {loadingProducts ? (
        <ProductsGridSkeleton count={6} />
      ) : (
        <ProductsSection
          title={
            isOwnProfile
              ? "Mis objetos publicados"
              : `Todos los productos de ${username}`
          }
          products={objects}
          profile={true}
          isOwnProfile={isOwnProfile}
        />
      )}
    </>
  );
}

export default UserObjectsPage;