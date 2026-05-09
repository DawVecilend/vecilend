import { useState } from "react";
import BenefitCard from "../elementos/BenefitCard";

function BenefitsSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const benefits = [
    {
      id: 1,
      icon: "search_check",
      title: "Buscar y Reservar",
      text: "Busca el artículo que necesitas y selecciona tus fechas de alquiler con facilidad.",
    },
    {
      id: 2,
      icon: "handshake",
      title: "Conocer al Propietario",
      text: "Coordina una ubicación de entrega segura o elige la entrega a domicilio.",
    },
    {
      id: 3,
      icon: "local_activity",
      title: "Disfrutar del Artículo",
      text: "Usa el equipo para tu proyecto, viaje o evento. ¡Es tuyo por la reserva!",
    },
    {
      id: 4,
      icon: "replay",
      title: "Devolver y Calificar",
      text: "Devuelve el artículo y deja una reseña para mantener nuestra comunidad confiable.",
    },
  ];

  return (
    <section className="py-24 bg-[#0b100f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-inter text-4xl font-extrabold tracking-tight mb-4 text-[#e1e3e0]">
            Alquilar nunca fue{" "}
            <span className="text-[#4fdbc8]">tan fácil.</span>
          </h2>
          <p className="text-[#aebdb9] text-lg">
            Cuatro pasos simples para obtener lo que necesitas o comenzar a
            ganar dinero con tus activos.
          </p>
        </div>
        <div className="relative grid md:grid-cols-4 gap-12">
          {benefits.map((benefit, idx) => (
            <div
              key={benefit.id}
              className="relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                aria-hidden="true"
                className="hidden md:block pointer-events-none absolute top-12 -translate-y-1/2 left-12 -right-6 h-0.5 transition-colors duration-300"
                style={{
                  backgroundColor:
                    hoveredIdx !== null && idx <= hoveredIdx
                      ? "#4fdbc8"
                      : "#333b39",
                }}
              />
              <BenefitCard
                icon={benefit.icon}
                title={benefit.title}
                text={benefit.text}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
