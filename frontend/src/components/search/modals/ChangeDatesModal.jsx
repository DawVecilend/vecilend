import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import DateRangeCalendar from "../../calendar/DateRangeCalendar";

function ChangeDatesModal({ open, onClose, initial, onApply }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [range, setRange] = useState({ start: null, end: null });
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (open) setResetKey((k) => k + 1);
  }, [open]);

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
        Cambiar fechas
        <IconButton onClick={onClose} sx={{ color: "var(--color-app-text-secondary)" }}>
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <DateRangeCalendar
          key={resetKey}
          initialRange={
            initial?.data_inici && initial?.data_fi
              ? { start: initial.data_inici, end: initial.data_fi }
              : undefined
          }
          onRangeChange={setRange}
        />
      </DialogContent>
      <DialogActions
        sx={{ borderTop: "1px solid var(--color-app-border)", px: 3, py: 2, gap: 1 }}
      >
        <button
          type="button"
          onClick={() => {
            onApply({ data_inici: null, data_fi: null });
            onClose();
          }}
          className="px-4 py-2 text-label text-app-text-secondary font-body underline"
        >
          Quitar filtro
        </button>
        <div className="flex-1" />
        <button
          type="button"
          disabled={!range.start || !range.end}
          onClick={() => {
            onApply({
              data_inici: range.start.format("YYYY-MM-DD"),
              data_fi: range.end.format("YYYY-MM-DD"),
            });
            onClose();
          }}
          className="rounded-full bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary px-6 py-3 text-body-base font-bold text-[var(--color-app-success-on)] disabled:opacity-50"
        >
          Aplicar
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangeDatesModal;
