#!/usr/bin/env bash
# Convierte imágenes locales (PNG/JPG/JPEG) a WebP y AVIF in-place
# Uso: bash scripts/optimize-images.sh
# Requisitos: cwebp y avifenc instalados
#   Ubuntu/Debian: sudo apt install webp libavif-bin
#   macOS:         brew install webp libavif

set -euo pipefail

PUBLIC_DIR="$(cd "$(dirname "$0")/.." && pwd)/public"
QUALITY_WEBP=82
QUALITY_AVIF=60

if ! command -v cwebp >/dev/null 2>&1; then
  echo "ERROR: cwebp no instalado. Instala con: sudo apt install webp"
  exit 1
fi

HAVE_AVIF=0
if command -v avifenc >/dev/null 2>&1; then
  HAVE_AVIF=1
else
  echo "WARN: avifenc no instalado. Solo se generará WebP."
  echo "      Instala con: sudo apt install libavif-bin"
fi

cd "$PUBLIC_DIR"

count_webp=0
count_avif=0
count_skip=0

while IFS= read -r -d '' file; do
  base="${file%.*}"
  ext="${file##*.}"
  ext_lc="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"

  if [[ "$ext_lc" != "png" && "$ext_lc" != "jpg" && "$ext_lc" != "jpeg" ]]; then
    continue
  fi

  webp_target="${base}.webp"
  if [[ ! -f "$webp_target" || "$file" -nt "$webp_target" ]]; then
    cwebp -quiet -q $QUALITY_WEBP "$file" -o "$webp_target"
    count_webp=$((count_webp+1))
    echo "  webp: $file"
  else
    count_skip=$((count_skip+1))
  fi

  if [[ "$HAVE_AVIF" -eq 1 ]]; then
    avif_target="${base}.avif"
    if [[ ! -f "$avif_target" || "$file" -nt "$avif_target" ]]; then
      avifenc --min 0 --max 63 -a end-usage=q -a cq-level=$((63-QUALITY_AVIF*63/100)) "$file" "$avif_target" >/dev/null 2>&1
      count_avif=$((count_avif+1))
      echo "  avif: $file"
    fi
  fi
done < <(find . -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -not -path "./node_modules/*" -print0)

echo ""
echo "Resumen:"
echo "  WebP generados : $count_webp"
echo "  AVIF generados : $count_avif"
echo "  Saltados       : $count_skip"
echo ""
echo "Listo. Sirve estos archivos junto a los originales y el componente OptimizedImage"
echo "se encargará de elegir el mejor formato soportado por el navegador."
