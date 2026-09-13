"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { revenusMensuels, revenusParCategorie } from "../lib/mock-data";

export function RevenusBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={revenusMensuels} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eee9db" />
        <XAxis
          dataKey="mois"
          tick={{ fill: "#6b6b60", fontSize: 12 }}
          axisLine={{ stroke: "#e7e2d6" }}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          formatter={(value) => [`${value}M FCFA`, "Revenus"] as [string, string]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e7e2d6", fontSize: 12 }}
        />
        <Bar dataKey="montant" radius={[6, 6, 0, 0]} fill="#16302a" />
      </BarChart>
    </ResponsiveContainer>
  );
}

const couleurs = ["#16302a", "#d2691e", "#c9a13b"];

export function CategoriesBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={revenusParCategorie}
        layout="vertical"
        margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke="#eee9db" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="categorie"
          width={130}
          tick={{ fill: "#2a2a24", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Part des revenus"] as [string, string]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e7e2d6", fontSize: 12 }}
        />
        <Bar dataKey="pourcentage" radius={[0, 6, 6, 0]} barSize={22}>
          {revenusParCategorie.map((_, i) => (
            <Cell key={i} fill={couleurs[i % couleurs.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
