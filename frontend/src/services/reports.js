import api from "./api";

export async function createReport({ usuari_reportat_id, objecte_id, motiu, descripcio }) {
  const payload = {
    usuari_reportat_id,
    motiu,
    descripcio: descripcio || null,
  };
  if (objecte_id) payload.objecte_id = objecte_id;
  const res = await api.post("/reports", payload);
  return res.data.data;
}

export const REPORT_MOTIUS = [
  { value: "comportament_inapropiat", label: "Comportamiento inapropiado" },
  { value: "objecte_inapropiat",      label: "Objeto inapropiado o no permitido" },
  { value: "frau_o_estafa",           label: "Fraude o estafa" },
  { value: "suplantacio_identitat",   label: "Suplantación de identidad" },
  { value: "spam",                    label: "Spam o publicidad no deseada" },
];
