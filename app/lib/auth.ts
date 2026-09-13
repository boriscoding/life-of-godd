// Rôles, utilisateurs simulés et matrice de permissions.
// Le frontend ne fait qu'adapter l'affichage : le backend doit revalider
// chaque permission côté API avant d'exécuter la moindre action.

export type Role = "super_admin" | "receptionniste" | "comptable";

export type Permission =
  | "dashboard:view"
  | "biens:view"
  | "biens:edit"
  | "reservations:view"
  | "reservations:edit"
  | "clients:view"
  | "clients:edit"
  | "paiements:view"
  | "paiements:edit"
  | "calendrier:view"
  | "calendrier:edit"
  | "rapports:view"
  | "parametres:view";

export type User = {
  id: string;
  nom: string;
  initiales: string;
  email: string;
  role: Role;
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Administrateur",
  receptionniste: "Réceptionniste",
  comptable: "Comptable",
};

// Comptes simulés (à remplacer par la vraie authentification côté backend).
export const USERS: User[] = [
  {
    id: "u1",
    nom: "Admin Gestionnaire",
    initiales: "AG",
    email: "admin@emeraude.cm",
    role: "super_admin",
  },
  {
    id: "u2",
    nom: "Marlène Kotto",
    initiales: "MK",
    email: "m.kotto@emeraude.cm",
    role: "receptionniste",
  },
  {
    id: "u3",
    nom: "Théo Essomba",
    initiales: "TE",
    email: "t.essomba@emeraude.cm",
    role: "comptable",
  },
];

// Ce que chaque rôle peut voir / modifier.
// "xxx:view" contrôle l'accès au menu et à la page.
// "xxx:edit" contrôle l'affichage des boutons Ajouter / Modifier / Supprimer.
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    "dashboard:view",
    "biens:view",
    "biens:edit",
    "reservations:view",
    "reservations:edit",
    "clients:view",
    "clients:edit",
    "paiements:view",
    "paiements:edit",
    "calendrier:view",
    "calendrier:edit",
    "rapports:view",
    "parametres:view",
  ],
  receptionniste: [
    "dashboard:view",
    "biens:view",
    "reservations:view",
    "reservations:edit",
    "clients:view",
    "clients:edit",
    "paiements:view",
    "calendrier:view",
    "calendrier:edit",
  ],
  comptable: [
    "dashboard:view",
    "biens:view",
    "reservations:view",
    "clients:view",
    "paiements:view",
    "paiements:edit",
    "calendrier:view",
    "rapports:view",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
