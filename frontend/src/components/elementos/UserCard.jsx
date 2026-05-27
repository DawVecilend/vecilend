import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

/**
 * @param {Object}            user
 * @param {?React.ReactNode}  action       Botó addicional renderitzat a la dreta
 * @param {?string}           profileHref  Si es passa, només l'avatar i el nom
 *                                         actuen com enllaç al perfil. La resta
 *                                         de la tarjeta no és clicable.
 */
function UserCard({ user, action = null, profileHref = null }) {
  const avg = user?.valoracio_propietari_avg;
  const total = user?.valoracio_propietari_total ?? 0;
  const hasRating = avg != null && total > 0;

  const avatarEl = user?.avatar_url ? (
    <img
      src={user.avatar_url}
      alt="Avatar usuario"
      className="h-[56px] w-[56px] md:h-[80px] md:w-[80px] rounded-full object-cover shrink-0"
    />
  ) : (
    <img
      src="/assets/icons/empty-user-icon.svg"
      alt=""
      className="h-[56px] w-[56px] md:h-[80px] md:w-[80px] shrink-0"
    />
  );

  const nameEl = (
    <p className="text-app-text text-[16px] lg:text-h3-desktop font-heading truncate">
      {user?.nom} {user?.cognoms}
    </p>
  );

  return (
    <div className="bg-app-card w-full rounded-2xl p-4">
      <div className="flex gap-3 items-center">
        {profileHref ? (
          <Link
            to={profileHref}
            className="shrink-0 hover:opacity-90 transition-opacity"
            aria-label={`Ver perfil de ${user?.nom ?? "usuario"}`}
          >
            {avatarEl}
          </Link>
        ) : (
          avatarEl
        )}

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {profileHref ? (
            <Link
              to={profileHref}
              className="self-start hover:opacity-90 transition-opacity max-w-full"
              aria-label={`Ver perfil de ${user?.nom ?? "usuario"}`}
            >
              {nameEl}
            </Link>
          ) : (
            nameEl
          )}

          {hasRating ? (
            <div className="flex items-center gap-2 flex-wrap">
              <Rating
                value={Number(avg)}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": { color: "#14B8A6" },
                  "& .MuiRating-iconEmpty": { color: "#14B8A6", opacity: 0.3 },
                }}
              />
              <span className="text-app-text-secondary text-label">
                {Number(avg).toFixed(1)} ({total}{" "}
                {total === 1 ? "valoración" : "valoraciones"})
              </span>
            </div>
          ) : (
            <p className="text-app-text-secondary text-label italic">
              Sin valoraciones
            </p>
          )}
        </div>

        {action && <div className="shrink-0 hidden md:block">{action}</div>}
      </div>

      {action && <div className="md:hidden mt-3">{action}</div>}
    </div>
  );
}

export default UserCard;
