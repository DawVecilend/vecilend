import { useNavigate } from "react-router-dom";

function CategoryPill({ id, name, icon }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/objects?category=${id}`)}
      className="group w-full h-36 p-5 rounded-xl text-center bg-app-bg-card border border-app-border hover:border-app-primary hover:shadow-lg hover:shadow-app-primary/10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3"
    >
      <span className="w-14 h-14 rounded-full flex items-center justify-center bg-app-primary/10 group-hover:bg-app-primary/20 group-hover:scale-110 transition-all duration-300 shrink-0">
        <span className="material-symbols-outlined text-app-primary text-3xl">
          {icon}
        </span>
      </span>
      <span className="font-bold text-xs md:text-sm text-app-text leading-tight">
        {name}
      </span>
    </button>
  );
}

export default CategoryPill;
