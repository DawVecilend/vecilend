import React from "react";
import { Rating } from "@mui/material";

function UserCard({ user }) {
  const avg = user?.valoracio_mitjana;
  const total = user?.valoracio_total ?? 0;
  const hasRating = avg != null && total > 0;

  return (
    <div className="flex bg-app-card w-full rounded-2xl p-4 gap-3 items-center">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="Avatar usuario"
          className="h-[80px] w-[80px] rounded-full object-cover shrink-0"
        />
      ) : (
        <img
          src="/assets/icons/empty-user-icon.svg"
          alt=""
          className="h-[80px] w-[80px] shrink-0"
        />
      )}

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-app-text text-h3-desktop font-heading truncate">
          {user?.nom} {user?.cognoms}
        </p>

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
    </div>
  );
}

export default UserCard;
