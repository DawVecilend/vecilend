function InlineFilterChip({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-label font-body transition-colors ${
        active
          ? "bg-vecilend-dark-primary/15 border-vecilend-dark-primary text-vecilend-dark-primary hover:bg-vecilend-dark-primary/25"
          : "bg-app-bg-card border-app-border text-app-text-secondary hover:border-vecilend-dark-primary hover:text-app-text"
      }`}
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      {label}
    </button>
  );
}

export default InlineFilterChip;
