import { useEffect } from "react";
import { calcPriceBreakdown } from "../../utils/pricing";

function DetailsPriceCardProduct({ product, diasSelected, onTotalChange }) {
  const { subtotal, comissio, garantia, total } = calcPriceBreakdown(
    product.preu_diari,
    diasSelected,
  );

  useEffect(() => {
    if (onTotalChange) onTotalChange(total);
  }, [total, onTotalChange]);

  return (
    <div className="rounded-2xl border border-app-border bg-app-bg-card-secondary mt-2 overflow-hidden">
      <div className="px-4 py-3 border-b border-app-border">
        <p className="text-app-text text-h3-mobile font-heading">
          Detalle del precio
        </p>
      </div>

      <div className="flex flex-col text-app-text px-4 py-3 text-label font-body">
        <div className="flex justify-between py-2 border-b border-app-border/40">
          <p className="text-app-text-secondary">Precio por día</p>
          <p>{Number(product.preu_diari).toFixed(2)} €</p>
        </div>

        <div className="flex justify-between py-2 border-b border-app-border/40">
          <p className="text-app-text-secondary">Días seleccionados</p>
          <p>{diasSelected}</p>
        </div>

        <div className="flex justify-between py-2 border-b border-app-border/40">
          <p className="text-app-text-secondary">Subtotal</p>
          <p>{subtotal.toFixed(2)} €</p>
        </div>

        <div className="flex justify-between py-2 border-b border-app-border/40">
          <p className="text-app-text-secondary">
            Comisión por transacción (5%)
          </p>
          <p>{comissio.toFixed(2)} €</p>
        </div>

        <div className="flex justify-between py-2 border-b border-app-border/40">
          <p className="text-app-text-secondary">Garantía de seguridad (5%)</p>
          <p>{garantia.toFixed(2)} €</p>
        </div>

        <div className="flex justify-between py-3">
          <p className="text-app-text font-bold">Precio total</p>
          <p className="text-vecilend-dark-primary font-bold text-h3-mobile">
            {total.toFixed(2)} €
          </p>
        </div>
      </div>
    </div>
  );
}

export default DetailsPriceCardProduct;
