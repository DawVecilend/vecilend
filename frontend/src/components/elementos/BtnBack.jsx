import { useNavigate } from "react-router-dom";

function BtnBack() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Volver"
      title="Volver"
      className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-app-bg-card transition-colors cursor-pointer"
    >
      <img
        src="/assets/icons/arrow-back-white-icon.svg"
        alt=""
        className="h-5 w-5"
      />
    </button>
  );
}

export default BtnBack;
