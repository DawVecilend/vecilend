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
        Cambiar fechas
        <IconButton onClick={onClose} sx={{ color: "#B6BCC8" }}>
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
        sx={{ borderTop: "1px solid #2A2B31", px: 3, py: 2, gap: 1 }}
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
          className="rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730] disabled:opacity-50"
        >
          Aplicar
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangeDatesModal;
