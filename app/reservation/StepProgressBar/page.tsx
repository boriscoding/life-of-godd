"use client";

export const RESERVATION_STEPS = [
  "Sélection",
  "Dates & Durée",
  "Informations",
  "Récapitulatif",
  "Paiement",
  "Confirmation",
] as const;

interface StepProgressBarProps {
  /** Étape courante, de 1 à 6 */
  current: number;
}

export function StepProgressBar({ current }: StepProgressBarProps) {
  const total = RESERVATION_STEPS.length;
  const progressPercent = ((current - 1) / (total - 1)) * 100;

  return (
    <div className="border-b border-gray-100 pb-4 sm:pb-5 lg:pb-6">
      {/* Mobile (< sm) : libellé compact + barre de progression */}
      <div className="space-y-2.5 sm:hidden">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span className="font-bold text-emerald-950">
            Étape {current}/{total}
          </span>
          <span className="text-emerald-900">{RESERVATION_STEPS[current - 1]}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-emerald-900 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tablette (sm à lg) : pastilles numérotées reliées, libellé de l'étape courante en dessous */}
      <div className="hidden sm:block lg:hidden">
        <div className="flex items-center">
          {RESERVATION_STEPS.map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < current;
            const isCurrent = stepNum === current;
            return (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                    isCurrent
                      ? "bg-emerald-950 text-white"
                      : isDone
                      ? "bg-emerald-900 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? "✓" : stepNum}
                </span>
                {idx < total - 1 && (
                  <span className={`mx-1.5 h-0.5 flex-1 rounded-full ${isDone ? "bg-emerald-900" : "bg-gray-100"}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs font-bold text-emerald-950">{RESERVATION_STEPS[current - 1]}</p>
      </div>

      {/* Desktop (lg+) : version complète d'origine avec libellés et coches */}
      <div className="hidden items-center justify-between gap-2 text-xs font-semibold text-gray-500 lg:flex">
        {RESERVATION_STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < current;
          const isCurrent = stepNum === current;
          return (
            <span
              key={label}
              className={`flex items-center gap-2 whitespace-nowrap ${
                isCurrent ? "font-bold text-emerald-950" : isDone ? "text-emerald-900" : ""
              }`}
            >
              {isDone ? (
                <span>✓</span>
              ) : (
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    isCurrent ? "bg-emerald-950 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {stepNum}
                </span>
              )}
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}