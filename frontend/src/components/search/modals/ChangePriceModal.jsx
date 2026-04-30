import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import PriceFilter from "../../filters/PriceFilter";

function ChangePriceModal({ open, onClose, initial, onApply }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [value, setValue] = useState({ minPrice: 0, maxPrice: 100 });

  useEffect(() => {
    if (!open) return;
    setValue({
      minPrice: initial?.min_price ? Number(initial.min_price) : 0,
      maxPrice: initial?.max_price ? Number(initial.max_price) : 100,
    });
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
        Precio
        <IconButton onClick={onClose} sx={{ color: "#B6BCC8" }}>
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <PriceFilter value={value} onChange={setValue} />
      </DialogContent>
      <DialogActions
        sx={{ borderTop: "1px solid #2A2B31", px: 3, py: 2, gap: 1 }}
      >
        <button
          type="button"
          onClick={() => {
            onApply({ min_price: null, max_price: null });
            onClose();
          }}
          className="px-4 py-2 text-label text-vecilend-dark-text-secondary font-body underline"
        >
          Quitar filtro
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            onApply({
              min_price: value.minPrice > 0 ? String(value.minPrice) : null,
              max_price: value.maxPrice < 100 ? String(value.maxPrice) : null,
            });
            onClose();
          }}
          className="rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730]"
        >
          Aplicar
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangePriceModal;
