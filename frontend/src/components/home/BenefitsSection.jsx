import BenefitCard from '../elementos/BenefitCard'

function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      icon: '/assets/icons/euro-icon.svg',
      title: 'Fiabilidad',
      text: 'Usuarios verificados'
    },
    {
      id: 2,
      icon: '/assets/icons/euro-icon.svg',
      title: 'Seguridad',
      text: 'Todas las transacciones son seguras'
    },
    {
      id: 3,
      icon: '/assets/icons/euro-icon.svg',
      title: 'Más barato que comprar',
      text: 'A menudo ahorras un 70%'
    },
    {
      id: 4,
      icon: '/assets/icons/location-icon.svg',
      title: 'Alquila cerca de ti',
      text: 'Lo que buscas está más cerca de lo que imaginas.'
    }
  ]

  return (
    <section className="w-full py-10">
      <div className="mx-auto flex w-full flex-wrap justify-center gap-5">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.id} icon={benefit.icon} title={benefit.title} text={benefit.text} />
        ))}
      </div>
    </section>
  )
}

export default BenefitsSection