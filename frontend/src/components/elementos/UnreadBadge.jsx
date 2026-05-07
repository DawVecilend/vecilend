function UnreadBadge({ count, className = "" }) {
  const n = Number(count) || 0;
  if (n <= 0) return null;

  return (
    <span
      className={
        "absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 " +
        "text-[10px] font-bold text-white bg-red-500 rounded-full leading-none " +
        "shadow-[0_0_0_2px_var(--color-app-bg)] " +
        className
      }
      aria-label={`${n} sin leer`}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

export default UnreadBadge;
