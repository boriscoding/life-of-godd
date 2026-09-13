import { ReactNode } from "react";

type Tone = "green" | "red" | "orange" | "gray";

const toneStyles: Record<Tone, string> = {
  green: "bg-[#e4f0e7] text-[#1e7145]",
  red: "bg-[#fbe7e4] text-[#c0392b]",
  orange: "bg-[#fbeadb] text-[#b85718]",
  gray: "bg-[#eeece4] text-[#6b6b60]",
};

const statutTone: Record<string, Tone> = {
  Disponible: "green",
  Confirmé: "green",
  Payé: "green",
  Fidèle: "green",
  Actif: "green",
  Occupé: "red",
  Annulé: "red",
  Échoué: "red",
  "En attente": "orange",
  Nouveau: "orange",
  Maintenance: "gray",
  Terminé: "gray",
  Remboursé: "gray",
};

export default function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const label = String(children);
  const resolved = tone ?? statutTone[label] ?? "gray";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${toneStyles[resolved]}`}
    >
      {children}
    </span>
  );
}
