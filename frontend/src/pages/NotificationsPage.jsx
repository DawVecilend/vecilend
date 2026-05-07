import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notifications";
import { useUnreadCounts } from "../contexts/UnreadCountsContext";

const TIPUS_META = {
  solicitud_rebuda: {
    icon: "inbox",
    color: "text-app-primary",
    link: () => "/orders?tab=requests_received",
  },
  solicitud_acceptada: {
    icon: "check_circle",
    color: "text-green-400",
    link: () => "/orders?tab=requests_sent",
  },
  solicitud_rebutjada: {
    icon: "cancel",
    color: "text-red-400",
    link: () => "/orders?tab=requests_sent",
  },
  solicitud_cancellada: {
    icon: "block",
    color: "text-zinc-400",
    link: () => "/orders?tab=requests_sent",
  },
  transaccio_pagament_pendent: {
    icon: "payments",
    color: "text-vecilend-dark-primary",
    link: (n) =>
      n.id_entitat_referenciada
        ? `/transactions/${n.id_entitat_referenciada}/payment`
        : "/orders?tab=transactions",
  },
  transaccio_cancellada: {
    icon: "block",
    color: "text-red-400",
    link: () => "/orders?tab=transactions",
  },
  transaccio_recordatori_devolucio: {
    icon: "schedule",
    color: "text-amber-400",
    link: () => "/orders?tab=transactions",
  },
  valoracio_rebuda: {
    icon: "star",
    color: "text-yellow-400",
    link: (n, user) =>
      user?.username ? `/profile/${user.username}` : "/orders",
  },
};

function formatRelative(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return "ahora";
  if (diffSec < 3600) return `hace ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `hace ${Math.floor(diffSec / 3600)} h`;
  if (diffSec < 604800) return `hace ${Math.floor(diffSec / 86400)} d`;
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
}

function NotificationRow({ notif, onRead, onDelete, currentUser }) {
  const meta = TIPUS_META[notif.tipus] || {
    icon: "notifications",
    color: "text-app-text-secondary",
    link: () => "/",
  };

  const linkTo = meta.link(notif, currentUser);

  return (
    <div
      className={
        "flex items-start gap-3 p-4 rounded-xl border transition-colors " +
        (notif.llegida
          ? "border-app-border bg-app-bg-card"
          : "border-app-primary/40 bg-app-bg-card-secondary")
      }
    >
      <div
        className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-app-bg-card border border-app-border ${meta.color}`}
      >
        <span className="material-symbols-outlined">{meta.icon}</span>
      </div>

      <Link
        to={linkTo}
        onClick={() => !notif.llegida && onRead(notif.id)}
        className="flex-1 min-w-0"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-app-text truncate">{notif.titol}</p>
          <span className="text-caption text-app-text-secondary shrink-0">
            {formatRelative(notif.created_at)}
          </span>
        </div>
        <p className="text-label text-app-text-secondary line-clamp-2">
          {notif.missatge}
        </p>
      </Link>

      <button
        type="button"
        onClick={() => onDelete(notif.id)}
        className="shrink-0 text-app-text-secondary hover:text-red-400 transition-colors"
        aria-label="Eliminar notificación"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
}

function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { decrementNotifications, refresh } = useUnreadCounts();

  const load = useCallback(async () => {
    try {
      const { data } = await getNotifications({ per_page: 50 });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando notificaciones:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRead(notifId) {
    try {
      await markNotificationAsRead(notifId);
      setItems((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, llegida: true } : n)),
      );
      decrementNotifications(1);
    } catch {}
  }

  async function handleDelete(notifId) {
    const target = items.find((n) => n.id === notifId);
    try {
      await deleteNotification(notifId);
      setItems((prev) => prev.filter((n) => n.id !== notifId));
      if (target && !target.llegida) decrementNotifications(1);
    } catch {}
  }

  async function handleMarkAll() {
    try {
      await markAllNotificationsAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, llegida: true })));
      refresh();
    } catch {}
  }

  const noLlegidesCount = items.filter((n) => !n.llegida).length;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pt-6 pb-32">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-h1-mobile md:text-h1-desktop font-extrabold text-app-text font-heading">
          Notificaciones
        </h1>
        {noLlegidesCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            className="text-app-primary font-bold text-label hover:underline"
          >
            Marcar todas como leídas
          </button>
        )}
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <div
            className="h-10 w-10 rounded-full border-4 border-app-border border-t-app-primary animate-spin"
            role="status"
            aria-label="Cargando"
          />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-app-border bg-app-bg-card p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-app-text-secondary">
            notifications_off
          </span>
          <p className="mt-3 text-app-text-secondary">
            Aún no tienes notificaciones.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n) => (
            <NotificationRow
              key={n.id}
              notif={n}
              onRead={handleRead}
              onDelete={handleDelete}
              currentUser={null}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default NotificationsPage;
