import React from "react";
import { Link } from "react-router-dom";
function NavCategori({ mainCategory, subCategory }) {
  return (
    <div className="text-app-text border-b-1 border-app-border pb-4">
      <Link to={"/objects"}>Todos los objetos</Link>
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
