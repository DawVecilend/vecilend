function BenefitCard({ icon, title, text }) {
  return (
    <article className="flex h-[65px] w-[314px] items-center rounded-full bg-vecilend-dark-primary-hover px-4">
      <div className="mr-4 flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-vecilend-dark-primary">
        <img src={icon} alt={title} className="h-[22px] w-[22px] object-contain" />
      </div>

      <div className="flex flex-col">
        <h3 className="font-heading text-h3-mobile leading-h3 font-semibold text-black">
          {title}
        </h3>

        <p className="font-body text-label leading-label text-black">
          {text}
        </p>
      </div>
    </article>
  )
}

export default BenefitCard