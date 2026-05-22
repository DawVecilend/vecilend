function OptimizedImage({
  src,
  alt = "",
  className = "",
  width,
  height,
  loading = "lazy",
  fetchPriority,
  sizes,
  ...rest
}) {
  if (!src) return null;

  const dotIndex = src.lastIndexOf(".");
  const base = dotIndex > 0 ? src.substring(0, dotIndex) : src;
  const ext = dotIndex > 0 ? src.substring(dotIndex + 1).toLowerCase() : "";

  const isExternal = /^https?:\/\//.test(src);
  const supportsConversion = !isExternal && ["png", "jpg", "jpeg"].includes(ext);

  if (!supportsConversion) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        fetchpriority={fetchPriority}
        decoding="async"
        {...rest}
      />
    );
  }

  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" sizes={sizes} />
      <source srcSet={`${base}.webp`} type="image/webp" sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        fetchpriority={fetchPriority}
        decoding="async"
        {...rest}
      />
    </picture>
  );
}

export default OptimizedImage;
