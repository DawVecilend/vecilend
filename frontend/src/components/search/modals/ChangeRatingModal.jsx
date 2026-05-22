import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import RatingFilter from "../../filters/RatingFilter";

function ChangeRatingModal({ open, onClose, initial, onApply }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [value, setValue] = useState({ minRating: 0 });

  useEffect(() => {
    if (!open) return;
    setValue({
      minRating: initial?.min_user_rating ? Number(initial.min_user_rating) : 0,
    });
  }, [open, initial]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      disableScrollLock
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-app-bg-card)",
          color: "var(--color-app-text)",
          borderRadius: isMobile ? 0 : 4,
          border: "1px solid var(--color-app-border)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Montserrat",
          fontWeight: 700,
          color: "var(--color-app-text)",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--color-app-border)",
        }}
      >
        Valoración mínima
        <IconButton onClick={onClose} sx={{ color: "var(--color-app-text-secondary)" }}>
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <RatingFilter value={value} onChange={setValue} />
      </DialogContent>
      <DialogActions
        sx={{ borderTop: "1px solid var(--color-app-border)", px: 3, py: 2, gap: 1 }}
      >
        <button
          type="button"
          onClick={() => {
            onApply({ min_user_rating: null });
            onClose();
          }}
          className="px-4 py-2 text-label text-app-text-secondary font-body underline"
        >
          Quitar filtro
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            onApply({
              min_user_rating:
                value.minRating > 0 ? String(value.minRating) : null,
            });
            onClose();
          }}
          className="rounded-full bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary px-6 py-3 text-body-base font-bold text-[var(--color-app-success-on)]"
        >
          Aplicar
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangeRatingModal;
