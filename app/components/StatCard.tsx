import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  label,
  value,
  trend,
  trendUp = true,
  valueClassName,
}: {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-em-border bg-em-card p-5">
      <p className="text-sm text-em-text-muted">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold text-em-text ${valueClassName ?? ""}`}>
        {value}
      </p>
      {trend && (
        <p
          className={`mt-2 flex items-center gap-1 text-xs font-medium ${
            trendUp ? "text-em-green" : "text-em-red"
          }`}
        >
          {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trend}
        </p>
      )}
    </div>
  );
}
