import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import LocationPicker from "../../map/LocationPicker";

function ChangeLocationModal({ open, onClose, initial, onApply }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [location, setLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(10);

  useEffect(() => {
    if (!open) return;
    setLocation(
      initial?.lat && initial?.lng
        ? { lat: Number(initial.lat), lng: Number(initial.lng) }
        : null,
    );
    setRadiusKm(
      initial?.radius ? Math.round(Number(initial.radius) / 1000) : 10,
    );
  }, [open, initial]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#0A0A0B",
          color: "#F2F4F8",
          borderRadius: isMobile ? 0 : 4,
          border: "1px solid #2A2B31",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Montserrat",
          fontWeight: 700,
          color: "#F2F4F8",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #2A2B31",
        }}
      >
        Cambiar ubicación
        <IconButton onClick={onClose} sx={{ color: "#B6BCC8" }}>
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <LocationPicker
          value={location}
          onChange={setLocation}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
        />
      </DialogContent>
      <DialogActions
        sx={{ borderTop: "1px solid #2A2B31", px: 3, py: 2, gap: 1 }}
      >
        <button
          type="button"
          onClick={() => {
            onApply({ lat: null, lng: null, radius: null });
            onClose();
          }}
          className="px-4 py-2 text-label text-app-text-secondary font-body underline"
        >
          Quitar filtro
        </button>
        <div className="flex-1" />
        <button
          type="button"
          disabled={!location}
          onClick={() => {
            onApply({
              lat: location.lat.toFixed(6),
              lng: location.lng.toFixed(6),
              radius: String(radiusKm * 1000),
            });
            onClose();
          }}
          className="rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] disabled:opacity-50"
        >
          Aplicar
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangeLocationModal;
