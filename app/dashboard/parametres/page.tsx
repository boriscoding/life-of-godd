"use client";

import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { api } from "@/app/lib/api";
import { Plus, Trash2, X, Loader2, CheckCircle2 } from "lucide-react";

interface UserApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: { name: string; slug: string };
}

function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

/* --- Composants réutilisables dynamiques --- */

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
        checked ? "bg-em-accent" : "bg-em-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Section({
  title,
  subtitle,
  bientotDisponible = false,
  children,
}: {
  title: string;
  subtitle?: string;
  bientotDisponible?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-em-border bg-em-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-em-text">{title}</h3>
        {bientotDisponible && (
          <span className="rounded-full bg-em-bg px-2.5 py-1 text-[10px] font-semibold uppercase text-em-text-muted">
            Bientôt disponible
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-sm text-em-text-muted">{subtitle}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-em-text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30 disabled:opacity-60"
      />
    </label>
  );
}

export default function ParametresPage() {
  // --- 1. Gestion des Utilisateurs (GET, DELETE, POST) ---
  const [utilisateurs, setUtilisateurs] = useState<UserApi[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // État Modale d'invitation d'utilisateur
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ firstName: "", lastName: "", email: "", role: "staff" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const res = await api.get("/users", { params: { limit: 100 } });
      setUtilisateurs(extractArray<UserApi>(res.data));
    } catch (err: any) {
      setUsersError(err.response?.data?.message || "Impossible de charger les utilisateurs.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) return;

    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUtilisateurs((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError(null);

    try {
      const res = await api.post("/users", inviteForm);
      const newUser = res.data?.data || res.data;
      if (newUser && newUser.id) {
        setUtilisateurs((prev) => [...prev, newUser]);
      } else {
        await fetchUsers(); // Rechargement si la réponse ne retourne pas l'objet complet
      }
      setIsInviteOpen(false);
      setInviteForm({ firstName: "", lastName: "", email: "", role: "staff" });
    } catch (err: any) {
      setInviteError(err.response?.data?.message || "Erreur lors de la création de l'utilisateur.");
    } finally {
      setInviteLoading(false);
    }
  };

  // --- 2. Informations de la Résidence (Champs contrôlés) ---
  const [residenceInfo, setResidenceInfo] = useState({
    nom: "Résidence Émeraude",
    ville: "Douala, Cameroun",
    telephone: "+237 233 42 10 88",
    email: "contact@emeraude.cm",
    adresse: "Rue de la Résidence, Bonapriso, Douala, Cameroun",
  });

  // --- 3. Préférences de Facturation (Champs contrôlés) ---
  const [billingInfo, setBillingInfo] = useState({
    devise: "FCFA (XAF)",
    taxe: "1 000 FCFA",
    acompte: "30 %",
    delai: "48 heures avant l'arrivée",
  });

  // --- 4. Notifications (Interrupteurs dynamiques) ---
  const [notifications, setNotifications] = useState({
    newBooking: true,
    paymentReceived: true,
    maintenance: false,
    weeklyReport: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- 5. Sécurité : Changement de Mot de Passe ---
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);

    if (!passwords.current || !passwords.next) {
      setPwdMessage({ type: "error", text: "Renseignez le mot de passe actuel et le nouveau." });
      return;
    }
    if (passwords.next.length < 8) {
      setPwdMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 8 caractères." });
      return;
    }
    if (passwords.next === passwords.current) {
      setPwdMessage({ type: "error", text: "Le nouveau mot de passe doit être différent de l'ancien." });
      return;
    }

    setPwdLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPwdMessage({ type: "success", text: "Mot de passe mis à jour avec succès." });
      setPasswords({ current: "", next: "" });
    } catch (err: any) {
      setPwdMessage({ type: "error", text: err.response?.data?.message || "Erreur lors de la mise à jour." });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <RequirePermission permission="parametres:view">
      <Topbar title="Paramètres" subtitle="Gérez les informations et préférences de la Résidence Émeraude." />

      <div className="grid grid-cols-1 gap-5 px-5 pb-10 sm:px-8 lg:grid-cols-3">
        {/* Colonne Gauche (Principale) */}
        <div className="space-y-5 lg:col-span-2">
          {/* Informations de la résidence */}
          <Section
            title="Informations de la résidence"
            subtitle="Ces informations apparaissent sur les factures et confirmations de réservation."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Nom de la résidence"
                value={residenceInfo.nom}
                onChange={(e) => setResidenceInfo({ ...residenceInfo, nom: e.target.value })}
              />
              <Field
                label="Ville"
                value={residenceInfo.ville}
                onChange={(e) => setResidenceInfo({ ...residenceInfo, ville: e.target.value })}
              />
              <Field
                label="Téléphone de contact"
                value={residenceInfo.telephone}
                onChange={(e) => setResidenceInfo({ ...residenceInfo, telephone: e.target.value })}
              />
              <Field
                label="E-mail de contact"
                value={residenceInfo.email}
                type="email"
                onChange={(e) => setResidenceInfo({ ...residenceInfo, email: e.target.value })}
              />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-em-text-muted">Adresse complète</span>
              <textarea
                rows={2}
                value={residenceInfo.adresse}
                onChange={(e) => setResidenceInfo({ ...residenceInfo, adresse: e.target.value })}
                className="w-full resize-none rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
              />
            </label>
          </Section>

          {/* Préférences de facturation */}
          <Section title="Préférences de facturation" subtitle="Devise et règles appliquées aux réservations.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Devise"
                value={billingInfo.devise}
                onChange={(e) => setBillingInfo({ ...billingInfo, devise: e.target.value })}
              />
              <Field
                label="Taxe de séjour (par nuit)"
                value={billingInfo.taxe}
                onChange={(e) => setBillingInfo({ ...billingInfo, taxe: e.target.value })}
              />
              <Field
                label="Acompte minimum à la réservation"
                value={billingInfo.acompte}
                onChange={(e) => setBillingInfo({ ...billingInfo, acompte: e.target.value })}
              />
              <Field
                label="Délai d'annulation gratuite"
                value={billingInfo.delai}
                onChange={(e) => setBillingInfo({ ...billingInfo, delai: e.target.value })}
              />
            </div>
          </Section>

          {/* Gestion des utilisateurs */}
          <Section title="Gestion des utilisateurs" subtitle="Les comptes ayant accès à l'espace admin.">
            {usersError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                {usersError}
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-em-border">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="bg-em-bg text-xs text-em-text-muted">
                    <th className="px-4 py-3 font-medium">Utilisateur</th>
                    <th className="px-2 py-3 font-medium">Rôle</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-em-text-muted">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement des utilisateurs...
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loadingUsers &&
                    utilisateurs.map((u) => (
                      <tr key={u.id} className="border-t border-em-border transition-colors hover:bg-em-bg/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-em-sidebar text-xs font-semibold text-white">
                              {getInitials(u.firstName, u.lastName)}
                            </span>
                            <div>
                              <p className="font-medium text-em-text">
                                {u.firstName} {u.lastName}
                              </p>
                              <p className="text-xs text-em-text-muted">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <Badge tone={u.role?.slug === "admin" ? "orange" : "gray"}>
                            {u.role?.name ?? u.role?.slug ?? "Utilisateur"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                            disabled={deletingId === u.id}
                            className="text-em-text-muted transition-colors hover:text-red-600 disabled:opacity-40"
                            aria-label="Supprimer l'utilisateur"
                            title="Supprimer l'utilisateur"
                          >
                            {deletingId === u.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}

                  {!loadingUsers && utilisateurs.length === 0 && !usersError && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-em-text-muted">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-em-accent transition-colors hover:opacity-80"
            >
              <Plus size={16} />
              Inviter un utilisateur
            </button>
          </Section>
        </div>

        {/* Colonne Droite (Secondaire) */}
        <div className="space-y-5">
          {/* Notifications */}
          <Section title="Notifications">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Nouvelle réservation</p>
                <p className="text-xs text-em-text-muted">Alerte par e-mail et notification.</p>
              </div>
              <Toggle
                checked={notifications.newBooking}
                onChange={() => toggleNotification("newBooking")}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Paiement reçu</p>
                <p className="text-xs text-em-text-muted">Alerte quand un paiement est confirmé.</p>
              </div>
              <Toggle
                checked={notifications.paymentReceived}
                onChange={() => toggleNotification("paymentReceived")}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Rappels de maintenance</p>
                <p className="text-xs text-em-text-muted">Suivi des biens en travaux.</p>
              </div>
              <Toggle
                checked={notifications.maintenance}
                onChange={() => toggleNotification("maintenance")}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Rapport hebdomadaire</p>
                <p className="text-xs text-em-text-muted">Résumé envoyé chaque lundi.</p>
              </div>
              <Toggle
                checked={notifications.weeklyReport}
                onChange={() => toggleNotification("weeklyReport")}
              />
            </div>
          </Section>

          {/* Sécurité */}
          <Section title="Sécurité">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {pwdMessage && (
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                    pwdMessage.type === "success"
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-red-100 bg-red-50 text-red-600"
                  }`}
                >
                  {pwdMessage.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  <span>{pwdMessage.text}</span>
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-em-text-muted">Mot de passe actuel</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-em-text-muted">Nouveau mot de passe</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                  className="w-full rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                />
              </label>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-sm font-medium text-em-text">Authentification à deux facteurs</p>
                  <p className="text-xs text-em-text-muted">Recommandé pour les administrateurs.</p>
                </div>
                <Toggle checked={false} disabled />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-em-border bg-white py-2.5 text-sm font-medium text-em-text hover:bg-em-bg disabled:opacity-50"
              >
                {pwdLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </button>
            </form>
          </Section>
        </div>
      </div>

      {/* --- Modale d'invitation d'un utilisateur --- */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-em-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-em-border pb-4">
              <h3 className="font-display text-base font-semibold text-em-text">Inviter un utilisateur</h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-em-text-muted hover:text-em-text"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="mt-4 space-y-4">
              {inviteError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {inviteError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Prénom"
                  placeholder="Jean"
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                />
                <Field
                  label="Nom"
                  placeholder="Dupont"
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                />
              </div>

              <Field
                label="Adresse E-mail"
                type="email"
                placeholder="jean.dupont@emeraude.cm"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-em-text-muted">Rôle</span>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                >
                  <option value="staff">Personnel / Staff</option>
                  <option value="admin">Administrateur</option>
                </select>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="rounded-lg border border-em-border bg-white px-4 py-2 text-sm font-medium text-em-text hover:bg-em-bg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading || !inviteForm.email}
                  className="flex items-center gap-2 rounded-lg bg-em-sidebar px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {inviteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RequirePermission>
  );
}