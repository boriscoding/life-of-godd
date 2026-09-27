"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "@/app/contexte/AuthContext";
import { api } from "@/app/lib/api";
import { formatFCFA } from "../../lib/mock-data";
import {
  uploadPropertyImages,
  extractEmbeddedImages,
  type UploadedImage,
} from "@/app/lib/propertyMedia";
import { Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";

export type { UserSession } from "@/app/contexte/AuthContext";

type PropertyType = "room" | "apartment" | "office";

interface PropertyApi {
  id: string;
  name: string;
  type: PropertyType;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  category?: string | null;
  capacity?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | string | null;
  pricePerDay?: number | string | null;
  basePrice?: number | string | null;
  price?: number | string | null;
  isActive: boolean;
  media?: any[];
  Media?: any[];
}

const tabs = ["Tous les biens", "Appartements", "Chambres", "Bureaux"] as const;
const tabToType: Record<(typeof tabs)[number], PropertyType | null> = {
  "Tous les biens": null,
  Appartements: "apartment",
  Chambres: "room",
  Bureaux: "office",
};

const typeLabel: Record<PropertyType, string> = {
  room: "Chambre",
  apartment: "Appartement",
  office: "Bureau d'Affaires",
};

function getPrice(b: PropertyApi): number {
  return Number(b.pricePerDay ?? b.basePrice ?? b.price ?? 0);
}

function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function extractItem<T>(payload: any): T {
  return (payload?.data ?? payload) as T;
}

interface PendingImage {
  file: File;
  previewUrl: string;
}

interface FormState {
  id: string | null;
  name: string;
  type: PropertyType;
  description: string;
  address: string;
  city: string;
  country: string;
  category: string;
  pricePerDay: string;
  capacity: string;
  bedrooms: string;
  bathrooms: string;
  surface: string;
  isActive: boolean;
  existingImages: UploadedImage[];
}

const emptyForm: FormState = {
  id: null,
  name: "",
  type: "room",
  description: "",
  address: "",
  city: "",
  country: "Cameroun",
  category: "",
  pricePerDay: "",
  capacity: "",
  bedrooms: "",
  bathrooms: "",
  surface: "",
  isActive: true,
  existingImages: [],
};

export default function BiensPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Tous les biens");
  const { can } = useAuth();
  const peutModifier = can("biens:edit");

  const [biens, setBiens] = useState<PropertyApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const pendingImagesRef = useRef<PendingImage[]>([]);
  pendingImagesRef.current = pendingImages;

  const loadBiens = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/properties", { params: { limit: 200 } });
      setBiens(extractArray<PropertyApi>(res.data));
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de charger les biens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBiens();
  }, []);

  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  const categorie = tabToType[tab];
  const filtres = useMemo(
    () => (categorie ? biens.filter((b) => b.type === categorie) : biens),
    [biens, categorie]
  );

  const clearPendingImages = () => {
    pendingImages.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPendingImages([]);
  };

  const closeModal = () => {
    clearPendingImages();
    setShowModal(false);
  };

  const openCreate = () => {
    clearPendingImages();
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (b: PropertyApi) => {
    clearPendingImages();
    setForm({
      id: b.id,
      name: b.name,
      type: b.type,
      description: b.description ?? "",
      address: b.address ?? "",
      city: b.city ?? "",
      country: b.country ?? "Cameroun",
      category: b.category ?? "",
      pricePerDay: String(getPrice(b) || ""),
      capacity: b.capacity ? String(b.capacity) : "",
      bedrooms: b.bedrooms ? String(b.bedrooms) : "",
      bathrooms: b.bathrooms ? String(b.bathrooms) : "",
      surface: b.surface ? String(b.surface) : "",
      isActive: b.isActive,
      existingImages: extractEmbeddedImages(b),
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newOnes: PendingImage[] = Array.from(fileList).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => [...prev, ...newOnes]);
    e.target.value = "";
  };

  const removePendingImage = (index: number) => {
    setPendingImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError("Le nom du bien est requis.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      description: form.description.trim() || undefined,
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      country: form.country.trim() || "Cameroun",
      category: form.category.trim() || undefined,
      pricePerDay: form.pricePerDay ? Number(form.pricePerDay) : undefined,
      capacity: form.capacity ? Number(form.capacity) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      surface: form.surface ? Number(form.surface) : undefined,
      isActive: form.isActive,
    };

    setSubmitting(true);
    try {
      let propertyId = form.id;

      if (form.id) {
        await api.patch(`/properties/${form.id}`, payload);
      } else {
        const res = await api.post("/properties", payload);
        const created = extractItem<PropertyApi>(res.data);
        propertyId = created.id;
      }

      if (propertyId && pendingImages.length > 0) {
        setUploadingImages(true);
        await uploadPropertyImages(
          propertyId,
          pendingImages.map((p) => p.file)
        );
        setUploadingImages(false);
      }

      await loadBiens();
      closeModal();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Impossible d'enregistrer ce bien.");
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce bien ? Cette action est irréversible.")) return;
    try {
      await api.delete(`/properties/${id}`);
      setBiens((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de supprimer ce bien.");
    }
  };

  return (
    <RequirePermission permission="biens:view">
      <Topbar title="Gestion des Biens" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-em-text">
              Catalogue des Hébergements &amp; Bureaux
            </h2>
            <p className="text-sm text-em-text-muted">
              {peutModifier
                ? "Ajoutez, modifiez ou organisez les différents espaces de la Résidence Émeraude."
                : "Consultation des différents espaces de la Résidence Émeraude (lecture seule)."}
            </p>
          </div>
          {peutModifier && (
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 rounded-lg bg-em-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark transition-colors"
            >
              <Plus size={16} />
              Ajouter un bien
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-em-sidebar text-white"
                  : "border border-em-border bg-white text-em-text-muted hover:text-em-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-em-border bg-em-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs text-em-text-muted border-b border-em-border bg-em-bg/50">
                  <th className="px-5 py-3.5 font-medium">Aperçu</th>
                  <th className="px-2 py-3.5 font-medium">Nom du bien</th>
                  <th className="px-2 py-3.5 font-medium">Catégorie</th>
                  <th className="px-2 py-3.5 font-medium">Prix / Nuit</th>
                  <th className="px-2 py-3.5 font-medium">Capacité</th>
                  <th className="px-2 py-3.5 font-medium">Statut</th>
                  {peutModifier && (
                    <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-em-text-muted">
                      Chargement des biens...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filtres.map((b) => {
                    const thumbnail = extractEmbeddedImages(b)[0]?.url;
                    return (
                      <tr key={b.id} className="border-t border-em-border hover:bg-em-bg/30 transition-colors">
                        <td className="px-5 py-3.5">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={b.name}
                              className="h-12 w-16 rounded-lg object-cover border border-em-border"
                            />
                          ) : (
                            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-em-bg text-[10px] text-em-text-muted border border-em-border">
                              {typeLabel[b.type]}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3.5 font-medium text-em-text">{b.name}</td>
                        <td className="px-2 py-3.5 text-em-text-muted">
                          {b.category || typeLabel[b.type]}
                        </td>
                        <td className="px-2 py-3.5 text-em-text font-medium">{formatFCFA(getPrice(b))}</td>
                        <td className="px-2 py-3.5 text-em-text-muted">{b.capacity ?? "—"}</td>
                        <td className="px-2 py-3.5">
                          <Badge tone={b.isActive ? "green" : "gray"}>
                            {b.isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </td>
                        {peutModifier && (
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(b)}
                                aria-label="Modifier"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-text hover:bg-em-bg transition-colors"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(b.id)}
                                aria-label="Supprimer"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-red hover:bg-em-bg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}

                {!loading && filtres.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-em-text-muted">
                      Aucun bien dans cette catégorie.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && (
            <div className="flex items-center justify-between border-t border-em-border px-5 py-3.5 text-sm text-em-text-muted">
              <span>{filtres.length} bien(s) affiché(s)</span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-em-border pb-3">
              <h3 className="font-display text-lg font-semibold text-em-text">
                {form.id ? "Modifier le bien" : "Ajouter un bien"}
              </h3>
              <button onClick={closeModal} className="text-em-text-muted hover:text-em-text p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs font-medium text-em-text-muted">Nom du bien</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-em-text-muted">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full resize-none rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Type de bien</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  >
                    <option value="room">Chambre</option>
                    <option value="apartment">Appartement</option>
                    <option value="office">Bureau d'Affaires</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">
                    Catégorie <span className="text-em-text-muted/60">(ex: F2, VIP, Standard)</span>
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Prix / nuit (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.pricePerDay}
                    onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Surface (m²)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.surface}
                    onChange={(e) => setForm({ ...form, surface: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Capacité</label>
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Chambres</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Salles de bain</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bathrooms}
                    onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Adresse</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Ville</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-em-text-muted">Pays</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full rounded-lg border border-em-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-em-accent"
                />
              </div>

              {/* Section Images */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-xs font-medium text-em-text-muted">
                  <ImagePlus size={14} /> Images du bien
                </label>

                {form.existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-[11px] text-em-text-muted">Déjà envoyées :</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {form.existingImages.map((img, index) => (
                        <img
                          key={img.id ?? index}
                          src={img.url}
                          alt={`Image existante ${index + 1}`}
                          className="h-20 w-full rounded-lg border border-em-border object-cover opacity-90"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {pendingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-[11px] text-em-text-muted">
                      Nouvelles images ({pendingImages.length}) — envoyées à l'enregistrement :
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {pendingImages.map((img, index) => (
                        <div key={index} className="group relative">
                          <img
                            src={img.previewUrl}
                            alt={`Nouvelle image ${index + 1}`}
                            className="h-20 w-full rounded-lg border border-em-border object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePendingImage(index)}
                            aria-label="Retirer cette image"
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-em-border px-3 py-4 text-xs font-medium text-em-text-muted hover:bg-em-bg transition-colors">
                  <ImagePlus size={16} />
                  Choisir une ou plusieurs images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFilesSelected}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-em-border pt-3">
                <span className="text-sm font-medium text-em-text">Bien actif</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isActive}
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.isActive ? "bg-em-accent" : "bg-em-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-em-accent py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark transition-colors disabled:opacity-50"
              >
                {submitting
                  ? uploadingImages
                    ? "Envoi des images..."
                    : "Enregistrement..."
                  : form.id
                  ? "Enregistrer les modifications"
                  : "Créer le bien"}
              </button>
            </form> 
          </div>
        </div>
      )}
    </RequirePermission>
  );
}