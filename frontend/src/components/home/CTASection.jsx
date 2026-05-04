import { Link } from "react-router-dom"

function CTASection() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="relative bg-[#1d2422] rounded-[3rem] p-12 md:p-12 overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-10 hidden lg:block">
                    <img 
                        className="w-full h-full object-cover grayscale" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC44sNhTIoY58H_fyN2VtPeI6nrbddIbaqbZo1_-mM3RbEBJD1S7T_CPPP9YK1nDVFBbJTKJ99ip5JCSd2RptOFfscKYBf4I-Q9Wuj_Dp9p8M2hgWHyuznbo10vhNybdLONLua7gksRiDSmTJahCa9NB7F646RdXieU1hTvkCSn4Wnz9QlkV35K9dkN9jzQK5hLhlAUseeRDk1a70ieRXWaal1MKsl_1UtptWv316ZuMFh1jN8DASQj_ebLoBYCHK2m_7kXD0VLWzoW" 
                        alt="Co-working space" 
                    />
                </div>
                <div className="relative z-10 max-w-xl md:max-w-1/2">
                    <h2 className="font-inter text-4xl md:text-6xl font-extrabold text-[#e1e3e0] leading-tight mb-8">
                        ¿Listo para convertir tu equipo en <span className="text-[#4fdbc8]">ingresos?</span>
                    </h2>
                    <p className="text-[#aebdb9] text-lg mb-10 leading-relaxed">
                        Únete a la comunidad de Vecilend y comienza a generar ingresos con tu equipo.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <Link to="/objects/create" className="bg-gradient-to-br from-[#14b8a6] to-[#4fdbc8] text-[#003730] px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-[#4fdbc8]/30 hover:scale-105 active:scale-95 transition-all">
                            Comenzar a alquilar
                        </Link>
                        <Link to="/how-it-works/renters" className="bg-white/5 backdrop-blur-md text-[#e1e3e0] border border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
                            ¿Cómo funciona?
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTASection