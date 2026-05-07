import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notifications";
import { useUnreadCounts } from "../../contexts/UnreadCountsContext";
import { formatDateTimeSmart } from "../utils/datetime";

/**
 * Genera el contingut visual de cada notificació a partir del seu tipus
 * + dades_extra. Els fallbacks (titol/missatge guardats a la BD) es
 * mantenen si dades_extra encara no està poblada (notificacions antigues).
 */
function buildNotificationContent(notif) {
  const d = notif.dades_extra || {};

  // Helper: link a l'objecte
  const objectLink = d.objecte_id ? `/objects/${d.objecte_id}` : null;
  const objectName = d.objecte_nom || "este objeto";
  const author = d.autor_nom || "Alguien";

  switch (notif.tipus) {
    case "solicitud_rebuda":
      return {
        icon: "inbox",
        color: "text-app-primary",
        title: "Nueva solicitud",
        message: d.objecte_nom
          ? `${author} ha solicitado «${d.objecte_nom}»` +
            (d.dies ? ` (${d.dies} día${d.dies === 1 ? "" : "s"}).` : ".")
          : notif.missatge,
        link: "/orders?tab=requests_received",
      };

    case "solicitud_acceptada":
      return {
        icon: "check_circle",
        color: "text-green-400",
        title: "Solicitud aceptada",
        message: d.objecte_nom
          ? `${author} ha aceptado tu solicitud sobre «${d.objecte_nom}».`
          : notif.missatge,
        link: "/orders?tab=requests_sent",
      };

    case "solicitud_rebutjada":
      return {
        icon: "cancel",
        color: "text-red-400",
        title: "Solicitud rechazada",
        message: d.objecte_nom
          ? `${author} ha rechazado tu solicitud sobre «${d.objecte_nom}».`
          : notif.missatge,
        link: "/orders?tab=requests_sent",
      };

    case "solicitud_cancellada":
      return {
        icon: "block",
        color: "text-zinc-400",
        title: "Solicitud cancelada",
        message: d.objecte_nom
          ? `${author} ha cancelado su solicitud sobre «${d.objecte_nom}».`
          : notif.missatge,
        link: "/orders?tab=requests_received",
      };

    case "transaccio_pagament_pendent":
      return {
        icon: "payments",
        color: "text-vecilend-dark-primary",
        title: "Pago pendiente",
        message: d.objecte_nom
          ? `Tu reserva de «${d.objecte_nom}» requiere pago para confirmarse.`
          : notif.missatge,
        link: notif.id_entitat_referenciada
          ? `/transactions/${notif.id_entitat_referenciada}/payment`
          : "/orders?tab=transactions",
      };

    case "transaccio_cancellada":
      return {
        icon: "block",
        color: "text-red-400",
        title: "Transacción cancelada",
        message: d.objecte_nom
          ? `${author} ha cancelado la transacción de «${d.objecte_nom}».`
          : notif.missatge,
        link: "/orders?tab=transactions",
      };

    case "transaccio_recordatori_devolucio":
      return {
        icon: "schedule",
        color: "text-amber-400",
        title: "Recordatorio de devolución",
        message: d.objecte_nom
          ? `Recuerda devolver «${d.objecte_nom}».`
          : notif.missatge,
        link: "/orders?tab=transactions",
      };

    case "valoracio_rebuda": {
      const score = d.puntuacio ? `${d.puntuacio}/5 ⭐` : "";
      return {
        icon: "star",
        color: "text-yellow-400",
        title: "Nueva valoración",
        message:
          d.objecte_nom && d.puntuacio
            ? `${author} te ha valorado con ${score} sobre «${d.objecte_nom}».`
            : notif.missatge || `${author} te ha valorado.`,
        link: objectLink || "/orders",
      };
    }

    default:
      return {
        icon: "notifications",
        color: "text-app-text-secondary",
        title: notif.titol,
        message: notif.missatge,
        link: "/",
      };
  }
}

function NotificationRow({ notif, onRead, onDelete }) {
  const content = buildNotificationContent(notif);
  const unread = !notif.llegida;

  return (
    <div
      className={
        "relative flex items-stretch gap-0 rounded-xl border overflow-hidden transition-colors " +
        (unread
          ? "border-app-primary/40 bg-app-bg-secondary"
          : "border-app-border bg-app-bg-card")
      }
    >
      {/* Banda lateral gruixuda per no-llegides */}
      <div
        className={
          "shrink-0 w-1.5 " + (unread ? "bg-app-primary" : "bg-transparent")
        }
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
        <div
          className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-app-bg-card border border-app-border ${content.color}`}
        >
          <span className="material-symbols-outlined">{content.icon}</span>
        </div>

        <Link
          to={content.link}
          onClick={() => unread && onRead(notif.id)}
          className="flex-1 min-w-0 group"
        >
          <div className="flex items-center justify-between gap-2">
            <p
              className={
                "truncate " +
                (unread
                  ? "font-bold text-app-text"
                  : "font-semibold text-app-text-secondary")
              }
            >
              {content.title}
            </p>
            <span className="text-caption text-app-text-secondary shrink-0">
              {formatDateTimeSmart(notif.created_at)}
            </span>
          </div>
          <p className="text-label text-app-text-secondary line-clamp-2 group-hover:text-app-text transition-colors">
            {content.message}
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
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default NotificationsPage;
