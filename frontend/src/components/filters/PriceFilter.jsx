import { Slider } from "@mui/material";
import { useState, useEffect } from "react";

/**
 * Filtre de rang de preu (€/dia).
 *
 * @param {Object} value           {minPrice, maxPrice}
 * @param {Function} onChange      (newValue) => void
 */
function PriceFilter({ value = {}, onChange }) {
  const [priceRange, setPriceRange] = useState([
    value.minPrice ?? 0,
    value.maxPrice ?? 100,
  ]);

  useEffect(() => {
    setPriceRange([value.minPrice ?? 0, value.maxPrice ?? 100]);
  }, [value.minPrice, value.maxPrice]);

  const reportChange = (range) => {
    onChange?.({ minPrice: range[0], maxPrice: range[1] });
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-label text-vecilend-dark-text-secondary font-body">
          Rango de precio (€/día)
        </span>
        <span className="text-label text-vecilend-dark-primary font-bold font-body">
          {priceRange[0]}€ –{" "}
          {priceRange[1] >= 100 ? "100€+" : priceRange[1] + "€"}
        </span>
      </div>
      <Slider
        value={priceRange}
        onChange={(_, v) => setPriceRange(v)}
        onChangeCommitted={(_, v) => reportChange(v)}
        min={0}
        max={100}
        step={1}
        valueLabelDisplay="auto"
        sx={{
          color: "#14B8A6",
          "& .MuiSlider-thumb": {
            backgroundColor: "#14B8A6",
            border: "3px solid #fff",
            width: 22,
            height: 22,
          },
          "& .MuiSlider-rail": { backgroundColor: "#2A2B31", opacity: 1 },
          "& .MuiSlider-track": { border: "none" },
        }}
      />
    </div>
  );
}

export default PriceFilter;
