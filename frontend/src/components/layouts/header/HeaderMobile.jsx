import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import SearchModal from "../../search/SearchModal";

function HeaderMobile() {
  const auth = useContext(AuthContext);
  const [searchOpen, setSearchOpen] = useState(false);

  if (!auth) return null;
  const { user, loading } = auth;
  if (loading) return null;

  return (
    <>
      <nav className="fixed bottom-4 left-1/2 z-50 w-[94%] max-w-[430px] -translate-x-1/2 rounded-[15px] bg-vecilend-dark-primary px-4 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.25)] md:hidden">
        <div className="flex items-end justify-between gap-2">
          <Link
            to="/"
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/home-icon.svg"
              alt="Inicio"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Inicio
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/search-white-icon.svg"
              alt="Buscar"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Buscar
            </span>
          </button>

          <Link
            to="/objects/create"
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/add-photo-icon.svg"
              alt="Subir producto"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Publicar
            </span>
          </Link>

          <Link
            to="/chats"
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/chats-fill-icon.svg"
              alt="Chats"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Chats
            </span>
          </Link>

          <Link
            to={`/profile/${user?.username}`}
            className="flex flex-col items-center justify-center text-white"
          >
            <img
              src="/assets/icons/person-white-icon.svg"
              alt="Mi perfil"
              className="h-[22px] w-[22px] object-contain"
            />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">
              Mi perfil
            </span>
          </Link>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default HeaderMobile;
