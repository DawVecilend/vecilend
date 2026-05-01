function TopUserCard({ name, image, rating }) {
  return (
    <article className="flex h-[66px] w-[196px] items-center gap-3 rounded-[12px] border border-vecilend-dark-primary/30 bg-app-card px-3">
      <img
        src={image}
        alt={name}
        className="h-[42px] w-[42px] rounded-full object-cover"
      />

      <div className="flex flex-col justify-center">
        <span className="font-body text-label leading-label text-vecilend-dark-primary">
          {rating}
        </span>

        <p className="font-body text-body-base leading-body text-app-text">
          {name}
        </p>
      </div>
    </article>
  );
}

export default TopUserCard;
