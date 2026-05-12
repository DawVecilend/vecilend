import { useNavigate } from "react-router-dom";

function CategoryPill({ id, name, icon }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/objects?category=${id}`)}
      className="group w-full h-36 bg-[#333b39] p-5 rounded-xl text-center hover:bg-[#4fdbc8] transition-all duration-300 cursor-pointer border border-white/5 flex flex-col items-center justify-center gap-3"
    >
      <div className="w-14 h-14 bg-[#1d2422] rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
        <span className="material-symbols-outlined text-[#4fdbc8] group-hover:text-[#003730] text-3xl">
          {icon}
        </span>
      </div>
      <span className="font-bold text-sm text-[#e1e3e0] group-hover:text-[#003730] leading-tight">
        {name}
      </span>
    </button>
  );
}

export default CategoryPill;
