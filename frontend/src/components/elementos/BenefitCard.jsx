function BenefitCard({ icon, title, text }) {
  return (
    <div className="relative z-10 group">
      <div className="w-24 h-24 bg-[#1d2422] text-white rounded-3xl flex items-center justify-center mb-8 group-hover:bg-[#4fdbc8] group-hover:text-[#003730] transition-all duration-500 shadow-xl shadow-black/20 border border-white/5">
          <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <h4 className="font-bold text-xl mb-3 text-[#e1e3e0]">{title}</h4>
      <p className="text-[#aebdb9] text-sm leading-relaxed">{text}</p>
    </div>
  )
}

export default BenefitCard