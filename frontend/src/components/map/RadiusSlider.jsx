import { Slider } from "@mui/material";

const RADIUS_MARKS = [
  { value: 1, label: "1 km" },
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20 km" },
];

function RadiusSlider({ value, onChange, disabled = false }) {
  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-label text-app-text-secondary font-body">
          Radio de búsqueda
        </span>
        <span className="text-label text-vecilend-dark-primary font-bold font-body">
          {value} km
        </span>
      </div>
      <Slider
        value={value}
        onChange={(_, v) => onChange(v)}
        step={1}
        min={1}
        max={20}
        marks={RADIUS_MARKS}
        valueLabelDisplay="off"
        disabled={disabled}
        sx={{
          color: "#14B8A6",
          "& .MuiSlider-thumb": {
            backgroundColor: "#14B8A6",
            border: "3px solid #fff",
            width: 22,
            height: 22,
            "&:hover, &.Mui-active": {
              boxShadow: "0 0 0 8px rgba(20,184,166,.16)",
            },
          },
          "& .MuiSlider-rail": { backgroundColor: "#2A2B31", opacity: 1 },
          "& .MuiSlider-track": { border: "none" },
          "& .MuiSlider-mark": { backgroundColor: "#4B5563" },
          "& .MuiSlider-markActive": { backgroundColor: "#14B8A6" },
          "& .MuiSlider-markLabel": {
            color: "#B6BCC8",
            fontSize: "12px",
            fontFamily: "Inter",
          },
        }}
      />
    </div>
  );
}

export default RadiusSlider;
