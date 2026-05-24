import React, { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import PasswordInput from "../elementos/PasswordInput";
import {
  setupTwoFactor,
  confirmTwoFactor,
  disableTwoFactor,
  getRecoveryCodes,
  regenerateRecoveryCodes,
} from "../../services/twoFactor";

function CloseButton({ onClick }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: "var(--color-app-text-secondary)",
      }}
    >
      <span className="material-symbols-outlined">close</span>
    </IconButton>
  );
}

function RecoveryCodesPanel({ codes, onDone, doneLabel = "He guardado mis códigos" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    const blob = new Blob(
      [
        "Códigos de recuperación de Vecilend\n",
        "==================================\n\n",
        "Guarda estos códigos en un lugar seguro. Cada uno solo se puede usar una vez.\n\n",
        codes.join("\n"),
        "\n",
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vecilend-recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-app-text-secondary">
        Guarda estos códigos en un lugar seguro. Te servirán para acceder a tu
        cuenta si pierdes el acceso a tu app de autenticación. Cada código solo
        se puede usar una vez.
      </p>

      <div className="grid grid-cols-2 gap-2 bg-app-bg-card border border-app-border rounded-lg p-4 font-mono text-sm">
        {codes.map((code) => (
          <div
            key={code}
            className="text-app-text tracking-wider text-center py-1"
          >
            {code}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border border-app-border text-app-text hover:bg-app-bg-card"
        >
          <span className="material-symbols-outlined text-base">
            {copied ? "check" : "content_copy"}
          </span>
          {copied ? "Copiados" : "Copiar"}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border border-app-border text-app-text hover:bg-app-bg-card"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Descargar .txt
        </button>

        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-vecilend-dark-primary text-[var(--color-app-success-on)]"
          >
            {doneLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function TwoFactorSetupModal({ open, onClose, onActivated, userHasPassword }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [step, setStep] = useState("loading");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStep("loading");
    setError("");
    setCode("");

    setupTwoFactor()
      .then((data) => {
        if (cancelled) return;
        setSecret(data.secret);
        setOtpauthUrl(data.otpauth_url);
        setRecoveryCodes(data.recovery_codes);
        setStep("scan");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            "No se ha podido iniciar la configuración del 2FA.",
        );
        setStep("error");
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleConfirm = async () => {
    setBusy(true);
    setError("");
    try {
      await confirmTwoFactor(code.replace(/\s/g, ""));
      setStep("recovery");
    } catch (err) {
      setError(
        err?.response?.data?.errors?.code?.[0] ||
          err?.response?.data?.message ||
          "Código incorrecto. Vuelve a intentarlo.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDone = () => {
    onActivated?.();
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-app-bg)",
          color: "var(--color-app-text)",
          borderRadius: isMobile ? 0 : "12px",
          border: "1px solid var(--color-app-border)",
        },
      }}
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
        {step === "recovery"
          ? "Guarda tus códigos de recuperación"
          : "Activar autenticación 2FA"}
        <CloseButton onClick={busy ? undefined : onClose} />
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "var(--color-app-border)" }}>
        {step === "loading" && (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-app-border border-t-vecilend-dark-primary" />
            <p className="mt-4 text-app-text-secondary">Generando configuración...</p>
          </div>
        )}

        {step === "error" && (
          <p className="text-[var(--color-app-danger)] text-sm">{error}</p>
        )}

        {step === "scan" && (
          <div className="space-y-5">
            <p className="text-sm text-app-text-secondary leading-relaxed">
              Escanea el código QR con una app de autenticación (Google
              Authenticator, Authy, 1Password, etc.).
            </p>

            <div className="flex justify-center bg-white p-4 rounded-lg">
              <QRCodeSVG value={otpauthUrl} size={200} level="M" />
            </div>

            <details className="text-xs">
              <summary className="cursor-pointer text-app-text-secondary hover:text-app-text">
                ¿No puedes escanear? Introduce el código manualmente
              </summary>
              <p className="mt-2 font-mono break-all bg-app-bg-card border border-app-border rounded p-2">
                {secret}
              </p>
            </details>

            <div className="space-y-2">
              <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest">
                Código de verificación
              </label>
              <input aria-label="Código de verificación"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-widest text-center text-lg focus:ring-2 focus:ring-vecilend-dark-primary focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-app-danger)]">{error}</p>
            )}
          </div>
        )}

        {step === "recovery" && (
          <RecoveryCodesPanel codes={recoveryCodes} onDone={handleDone} />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {step === "scan" && (
          <>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-full border border-app-border px-5 py-2 text-sm font-body text-app-text hover:bg-app-bg-card disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy || code.length !== 6}
              className="rounded-full bg-vecilend-dark-primary px-5 py-2 text-sm font-bold text-[var(--color-app-success-on)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? "Verificando..." : "Activar 2FA"}
            </button>
          </>
        )}
        {step === "error" && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-app-border px-5 py-2 text-sm font-body text-app-text hover:bg-app-bg-card"
          >
            Cerrar
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export function TwoFactorDisableModal({ open, onClose, onDisabled, userHasPassword }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setCode("");
      setError("");
    }
  }, [open]);

  const handleDisable = async () => {
    setBusy(true);
    setError("");
    try {
      await disableTwoFactor({
        password: userHasPassword ? password : undefined,
        code: code.trim(),
      });
      onDisabled?.();
      onClose?.();
    } catch (err) {
      setError(
        err?.response?.data?.errors?.code?.[0] ||
          err?.response?.data?.errors?.password?.[0] ||
          err?.response?.data?.message ||
          "No se ha podido desactivar el 2FA.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-app-bg)",
          color: "var(--color-app-text)",
          borderRadius: isMobile ? 0 : "12px",
          border: "1px solid var(--color-app-border)",
        },
      }}
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
        Desactivar 2FA
        <CloseButton onClick={busy ? undefined : onClose} />
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "var(--color-app-border)" }}>
        <p className="text-sm text-app-text-secondary mb-4 leading-relaxed">
          {userHasPassword
            ? "Al desactivar el 2FA tu cuenta dependerá solo de la contraseña. Introduce tu contraseña y un código actual o de recuperación para confirmar."
            : "Al desactivar el 2FA tu cuenta dependerá solo del inicio de sesión con Google. Introduce un código actual de tu app de autenticación o un código de recuperación para confirmar."}
        </p>

        {userHasPassword && (
          <div className="space-y-2 mb-3">
            <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest">
              Contraseña
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-vecilend-dark-primary focus:border-transparent outline-none text-app-text"
              placeholder="••••••••"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest">
            Código de verificación o de recuperación
          </label>
          <input aria-label="Código de verificación o de recuperación"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="text"
            autoComplete="one-time-code"
            placeholder="123456 o XXXXX-XXXXX"
            className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-wider focus:ring-2 focus:ring-vecilend-dark-primary focus:border-transparent outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--color-app-danger)] mt-3">{error}</p>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="rounded-full border border-app-border px-5 py-2 text-sm font-body text-app-text hover:bg-app-bg-card disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleDisable}
          disabled={busy || !code.trim() || (userHasPassword && !password)}
          className="rounded-full bg-[var(--color-app-danger)] px-5 py-2 text-sm font-bold text-[var(--color-app-success-on)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Desactivando..." : "Desactivar 2FA"}
        </button>
      </DialogActions>
    </Dialog>
  );
}

export function TwoFactorRecoveryModal({ open, onClose, userHasPassword }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [phase, setPhase] = useState("auth");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    if (!open) {
      setPhase("auth");
      setPassword("");
      setCode("");
      setError("");
      setCodes([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await getRecoveryCodes({
        password: userHasPassword ? password : undefined,
        code: code.trim(),
      });
      setCodes(data.recovery_codes || []);
      setPhase("show");
    } catch (err) {
      setError(
        err?.response?.data?.errors?.code?.[0] ||
          err?.response?.data?.errors?.password?.[0] ||
          err?.response?.data?.message ||
          "No se han podido cargar los códigos.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRegenerate = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await regenerateRecoveryCodes({
        password: userHasPassword ? password : undefined,
        code: code.trim(),
      });
      setCodes(data.recovery_codes || []);
    } catch (err) {
      setError(
        err?.response?.data?.errors?.code?.[0] ||
          err?.response?.data?.errors?.password?.[0] ||
          err?.response?.data?.message ||
          "No se han podido regenerar los códigos.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-app-bg)",
          color: "var(--color-app-text)",
          borderRadius: isMobile ? 0 : "12px",
          border: "1px solid var(--color-app-border)",
        },
      }}
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
        Códigos de recuperación
        <CloseButton onClick={busy ? undefined : onClose} />
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "var(--color-app-border)" }}>
        {phase === "auth" && (
          <>
            <p className="text-sm text-app-text-secondary mb-4 leading-relaxed">
              Confirma tu identidad para ver tus códigos de recuperación.
            </p>

            {userHasPassword && (
              <div className="space-y-2 mb-3">
                <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest">
                  Contraseña
                </label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-vecilend-dark-primary focus:border-transparent outline-none text-app-text"
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-app-text-secondary uppercase tracking-widest">
                Código de verificación
              </label>
              <input aria-label="Código de verificación"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                className="w-full bg-app-bg-card border border-app-border rounded-lg px-4 py-3 text-app-text font-mono tracking-widest text-center text-lg focus:ring-2 focus:ring-vecilend-dark-primary focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-app-danger)] mt-3">
                {error}
              </p>
            )}
          </>
        )}

        {phase === "show" && (
          <>
            <RecoveryCodesPanel codes={codes} />
            <div className="mt-6 pt-4 border-t border-app-border">
              <p className="text-sm text-app-text-secondary mb-3">
                ¿Quieres invalidar estos códigos y generar 10 nuevos? Los
                anteriores dejarán de funcionar.
              </p>
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border border-[var(--color-app-warning)] text-[var(--color-app-warning)] hover:bg-[var(--color-app-warning)]/10 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">
                  refresh
                </span>
                {busy ? "Regenerando..." : "Regenerar códigos"}
              </button>
              {error && (
                <p className="text-sm text-[var(--color-app-danger)] mt-3">
                  {error}
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {phase === "auth" && (
          <>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-full border border-app-border px-5 py-2 text-sm font-body text-app-text hover:bg-app-bg-card disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={busy || code.length !== 6 || (userHasPassword && !password)}
              className="rounded-full bg-vecilend-dark-primary px-5 py-2 text-sm font-bold text-[var(--color-app-success-on)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? "Verificando..." : "Ver códigos"}
            </button>
          </>
        )}
        {phase === "show" && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-vecilend-dark-primary px-5 py-2 text-sm font-bold text-[var(--color-app-success-on)]"
          >
            Cerrar
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
}
