import BenefitCard from '../elementos/BenefitCard'

function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      icon: 'search_check',
      title: 'Buscar y Reservar',
      text: 'Busca el artículo que necesitas y selecciona tus fechas de alquiler con facilidad.'
    },
    {
      id: 2,
      icon: 'handshake',
      title: 'Conocer al Propietario',
      text: 'Coordina una ubicación de entrega segura o elige la entrega a domicilio.'
    },
    {
      id: 3,
      icon: 'local_activity',
      title: 'Disfrutar del Artículo',
      text: 'Usa el equipo para tu proyecto, viaje o evento. ¡Es tuyo por la reserva!'
    },
    {
      id: 4,
      icon: 'replay',
      title: 'Devolver y Calificar',
      text: 'Devuelve el artículo y deja una reseña para mantener nuestra comunidad confiable.'
    }
  ]

  return (
    // <section className="w-full py-10">
    //   <div className="mx-auto flex w-full flex-wrap justify-center gap-5">
    //     {benefits.map((benefit) => (
    //       <BenefitCard key={benefit.id} icon={benefit.icon} title={benefit.title} text={benefit.text} />
    //     ))}
    //   </div>
    // </section>

    <section className="py-24 bg-[#0b100f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="font-inter text-4xl font-extrabold tracking-tight mb-4 text-[#e1e3e0]">
                    Alquilar nunca fue <span className="text-[#4fdbc8]">tan fácil.</span>
                </h2>
                <p className="text-[#aebdb9] text-lg">Cuatro pasos simples para obtener lo que necesitas o comenzar a ganar dinero con tus activos.</p>
            </div>
            <div className="relative grid md:grid-cols-4 gap-12">
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-[#333b39] -z-0">
                    <div className="h-full bg-[#4fdbc8] w-1/3"></div>
                </div>
                
                {benefits.map((benefit) => (
                    <BenefitCard key={benefit.id} icon={benefit.icon} title={benefit.title} text={benefit.text} />
                ))}
                
            </div>
        </div>
    </section>
  )
}

export default BenefitsSection