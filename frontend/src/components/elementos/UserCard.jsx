import React from "react";
import { Rating } from "@mui/material";

function UserCard({ user }) {
  const valoracion = user.valoracio_mitjana ?? 3.5;
  const totalreseñas = user.total_reseñas ?? 5;
  return (
    <>
      <div className="flex bg-app-bg-card w-full rounded-2xl h-[183px] p-4 gap-2">
        <div>
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Avatar usuario"
              className="h-[80px] w-[80px] rounded-full object-cover"
            />
          ) : (
            <img
              src="/assets/icons/empty-user-icon.svg"
              alt=""
              className="h-[80px]"
            />
          )}
        </div>
        <div>
          <div>
            <p className="text-app-text text-h2-desktop">
              {user.nom} {user.cognoms}
            </p>
          </div>
          <div className="flex gap-1">
            <Rating
              defaultValue={valoracion}
              precision={0.5}
              readOnly
              className="h-[28px]"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: " #14B8A6",
                },
                "& .MuiRating-iconEmpty": {
                  color: "#14B8A6",
                  opacity: 1,
                },
              }}
            />
            <p className="text-app-text text-body-desktop">
              ({totalreseñas} reseñas)
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}

export default UserCard;
