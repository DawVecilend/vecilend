import React from "react";
import { Link } from "react-router-dom";
function NavCategori({ mainCategory, subCategory }) {
  return (
    <div className="text-vecilend-dark-text border-b-1 border-vecilend-dark-border pb-4">
      <Link to={"/objects"}>Todas las categorías</Link>
      <span> &gt; </span>
      <Link to={"/objects?category=" + mainCategory.id}>{mainCategory.nom}</Link>
      <span> &gt; </span>
      <Link
        to={
          "/objects?category=" + mainCategory.id + "&subcategory=" + subCategory.id
        }
      >
        {subCategory.nom}
      </Link>
    </div>
  );
}
export default NavCategori;
