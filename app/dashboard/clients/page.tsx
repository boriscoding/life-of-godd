"use client";

import { useState, useEffect, FormEvent } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "@/app/contexte/AuthContext";
import { formatFCFA } from "../../lib/mock-data";
import { api } from "../../lib/api"; // Import de votre instance Axios préconfigurée
import { Plus, Mail, Phone, Search, Filter, Loader2, X } from "lucide-react";

export type { UserSession } from "@/app/contexte/AuthContext";

export interface Client {
  id: string;
  nom: string;
  initiales: string;
  email: string;
  telephone: string;
  reservations: number;
  totalDepense: number;
  statut: "Actif" | "Inactif" | "VIP" | string;
  depuis: string;
}

const filtresStatut = ["Tous", "Actif", "Inactif", "VIP"] as const;

export default function ClientsPage() {
  const { can } = useAuth();
  const peutModifier = can("clients:edit");

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [recherche, setRecherche] = useState("");
  const [statut, setStatut] = useState<string>("Tous");

  // État pour la fenêtre modale de création
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });

// 1. Récupération globale de TOUS les utilisateurs (sans filtre sur l'ID connecté)
const fetchClients = async () => {
  try {
    setLoading(true);
    setError(null);

    // Requête vers GET /users (récupère tout le répertoire)
    const response = await api.get("/users");

    // Votre backend renvoie { success: true, message: "...", data: { data: User[], total, page, limit } }
    const payload = response.data?.data;
    const rawUsers = Array.isArray(payload) ? payload : (payload?.data || []);

    // Conversion de tous les utilisateurs récupérés pour le tableau
    const clientsMappes: Client[] = rawUsers.map((item: any) => {
      const firstName = item.firstName || "";
      const lastName = item.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || item.email || "Utilisateur";

      const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "US";

      return {
        id: item.id,
        nom: fullName,
        initiales: initials,
        email: item.email || "N/A",
        telephone: item.phone || "N/A",
        reservations: item.reservationsCount || 0,
        totalDepense: item.totalSpent || 0,
        statut: item.isActive ? "Actif" : "Inactif",
        depuis: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("fr-FR")
          : "Récemment",
      };
    });

    setClients(clientsMappes);
  } catch (err: any) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    setError(
      err.response?.data?.message || err.message || "Impossible de charger la liste des utilisateurs."
    );
  } finally {
    setLoading(false);
  }
};  

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Création d'un client via l'API
  const handleCreateClient = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // Séparation du nom complet en firstName et lastName
      const nameParts = formData.nom.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await api.post("/users", {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.telephone,
      });

      await fetchClients();
      setIsModalOpen(false);
      setFormData({ nom: "", email: "", telephone: "" });
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrage côté client pour la recherche et les badges
  const clientsFiltres = clients.filter((c) => {
    const correspondRecherche =
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.email.toLowerCase().includes(recherche.toLowerCase()) ||
      c.telephone.includes(recherche);

    const correspondStatut = statut === "Tous" || c.statut === statut;

    return correspondRecherche && correspondStatut;
  });

  return (
    <RequirePermission permission="clients:view">
      <Topbar title="Clients" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-em-text">
              Répertoire général des clients ({clientsFiltres.length} / {clients.length})
            </h2>
            <p className="text-sm text-em-text-muted">
              Historique et coordonnées issues de la base de données via l&apos;API.
            </p>
          </div>
          {peutModifier && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-em-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark transition-colors"
            >
              <Plus size={16} />
              Ajouter un client
            </button>
          )}
        </div>

        {/* Barre de Recherche & Filtres */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-em-text-muted"
            />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full rounded-lg border border-em-border bg-white py-2 pl-9 pr-4 text-sm text-em-text placeholder:text-em-text-muted/60 focus:outline-none focus:ring-2 focus:ring-em-accent/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter size={15} className="text-em-text-muted shrink-0" />
            {filtresStatut.map((f) => (
              <button
                key={f}
                onClick={() => setStatut(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statut === f
                    ? "bg-em-sidebar text-white"
                    : "border border-em-border bg-white text-em-text-muted hover:text-em-text"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau de données */}
        <div className="rounded-xl border border-em-border bg-em-card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-em-text-muted">
                <Loader2 className="animate-spin mr-2" size={22} />
                <span>Chargement des clients en cours...</span>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-red-500">
                <p>{error}</p>
                <button
                  onClick={fetchClients}
                  className="mt-3 text-xs underline font-medium text-em-accent"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="text-xs text-em-text-muted border-b border-em-border bg-em-bg/50">
                    <th className="px-5 py-4 font-medium">Client</th>
                    <th className="px-2 py-4 font-medium">Contact</th>
                    <th className="px-2 py-4 font-medium">Réservations</th>
                    <th className="px-2 py-4 font-medium">Total dépensé</th>
                    <th className="px-2 py-4 font-medium">Statut</th>
                    <th className="px-5 py-4 font-medium">Client depuis</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsFiltres.length > 0 ? (
                    clientsFiltres.map((c) => (
                      <tr
                        key={c.id}
                        className="border-t border-em-border hover:bg-em-bg/40 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-em-sidebar text-xs font-semibold text-white">
                              {c.initiales}
                            </span>
                            <span className="font-medium text-em-text">{c.nom}</span>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1 text-xs text-em-text-muted">
                            <div className="flex items-center gap-1.5">
                              <Mail size={12} />
                              {c.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone size={12} />
                              {c.telephone}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-em-text">{c.reservations}</td>
                        <td className="px-2 py-4 font-medium text-em-text">
                          {formatFCFA(c.totalDepense)}
                        </td>
                        <td className="px-2 py-4">
                          <Badge>{c.statut}</Badge>
                        </td>
                        <td className="px-5 py-4 text-em-text-muted">{c.depuis}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm text-em-text-muted">
                        Aucun client ne correspond à votre recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal de création de client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-em-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-em-border pb-3">
              <h3 className="font-semibold text-em-text">Nouveau client</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-em-text-muted hover:text-em-text"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-em-text-muted mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full rounded-lg border border-em-border px-3 py-2 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                  placeholder="ex: Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-em-text-muted mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-em-border px-3 py-2 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                  placeholder="jean.dupont@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-em-text-muted mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full rounded-lg border border-em-border px-3 py-2 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                  placeholder="+237 6xx xx xx xx"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-em-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-em-border px-4 py-2 text-sm font-medium text-em-text hover:bg-em-bg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-em-accent px-4 py-2 text-sm font-medium text-white hover:bg-em-accent-dark disabled:opacity-50"
                >
                  {submitting && <Loader2 className="animate-spin" size={14} />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RequirePermission>
  );
}``