"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { revenusMensuels } from "../lib/mock-data";

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={revenusMensuels} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eee9db" />
        <XAxis
          dataKey="mois"
          tick={{ fill: "#6b6b60", fontSize: 12 }}
          axisLine={{ stroke: "#e7e2d6" }}
          tickLine={false}
        />
        <YAxis hide domain={["dataMin - 0.5", "dataMax + 0.5"]} />
        <Tooltip
          formatter={(value) => [`${value}M FCFA`, "Revenus"] as [string, string]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e7e2d6",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="montant"
          stroke="#c0392b"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#c0392b" }}
          activeDot={{ r: 5 }}
          label={{ position: "top", fontSize: 11, fill: "#2a2a24", formatter: (v) => `${v}M` }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
