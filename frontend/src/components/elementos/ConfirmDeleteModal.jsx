import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";

/**
 * Modal genèric de confirmació per a accions destructives (eliminar).
 *
 * Segueix l'estil del Dialog de la resta de l'app (ChangePriceModal,
 * ChangeLocationModal, etc.). Pensat per ser reutilitzable: passa-li
 * `title`, `message`, opcionalment una `description` extra, i els
 * callbacks `onConfirm` i `onClose`.
 *
 * Props:
 *   - open:        bool, controla si es mostra
 *   - onClose:     fn, tancar sense fer res
 *   - onConfirm:   fn async/sync, l'acció destructiva
 *   - title:       text del títol (per defecte "¿Eliminar?")
 *   - message:     text principal de confirmació
 *   - description: text secundari opcional (subtítol gris)
 *   - confirmLabel: text del botó vermell (per defecte "Eliminar")
 *   - busy:        bool, deshabilita els botons mentre es processa
 *   - errorMessage: text d'error opcional a mostrar dins del modal
 */
function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "¿Eliminar?",
  message,
  description,
  confirmLabel = "Eliminar",
  busy = false,
  errorMessage = null,
}) {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="xs"
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
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2A2B31",
        }}
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ef4444]">
            warning
          </span>
          {title}
        </span>
        <IconButton onClick={onClose} disabled={busy} sx={{ color: "#B6BCC8" }}>
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <p className="text-body-base text-app-text font-body">{message}</p>
        {description && (
          <p className="mt-3 text-label text-app-text-secondary font-body">
            {description}
          </p>
        )}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#ef4444]/50 bg-[#ef4444]/10 px-3 py-2">
            <span className="material-symbols-outlined text-sm text-[#ef4444] mt-0.5">
              error
            </span>
            <p className="text-xs text-[#ef4444] font-body leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}
      </DialogContent>

      <DialogActions
        sx={{ borderTop: "1px solid #2A2B31", px: 3, py: 2, gap: 1 }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="rounded-full border border-[#2A2B31] px-5 py-2 text-label font-body text-app-text hover:bg-[#16181C] disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-full bg-[#ef4444] hover:bg-[#dc2626] px-5 py-2 text-label font-bold text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Eliminando…" : confirmLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
