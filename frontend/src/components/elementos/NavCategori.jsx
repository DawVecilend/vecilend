import React from 'react'
import { Link } from 'react-router-dom'

function NavCategori({ mainCategory, subCategory }) {
    return (
        <div className='text-vecilend-dark-text border-b-1 border-vecilend-dark-border pb-4'>
            <Link to={"/categorias"}>Todas las categorias</Link>
            <span> &gt; </span>
            <Link to={"/categorias/" + (mainCategory?.slug || "")}>
                {mainCategory?.nom || ""}
            </Link>
            <span> &gt; </span>
            <Link to={"/categorias/PorCrear"}>{subCategory}</Link>
        </div>
    )
}

export default NavCategori