function BenefitCard({ icon, title, text }) {
  return (
    <div className="relative z-10 group flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="w-24 h-24 bg-app-bg-card text-app-text rounded-3xl flex items-center justify-center mb-8 group-hover:bg-vecilend-dark-primary group-hover:text-[var(--color-app-success-on)] transition-all duration-500 shadow-xl shadow-black/20 border border-app-border">
          <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <h4 className="font-bold text-xl mb-3 text-app-text">{title}</h4>
      <p className="text-app-text-secondary text-sm leading-relaxed">{text}</p>
    </div>
  )
}

export default BenefitCard
