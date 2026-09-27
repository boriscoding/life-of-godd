export interface UploadedImage {
  id?: string;
  url: string;
  title?: string | null;
  isPrimary?: boolean;
}

// Même valeur que app/lib/api.ts, pour rester cohérent sans dépendre de
// cette instance axios (voir pourquoi ci-dessous).
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function extractItem<T>(payload: any): T {
  return (payload?.data ?? payload) as T;
}

/**
 * Upload d'un fichier en multipart/form-data.
 *
 * ⚠️ Volontairement `fetch` natif plutôt que l'instance axios `api` : cette
 * instance fixe `Content-Type: application/json` par défaut sur toutes ses
 * requêtes (voir app/lib/api.ts), et ce défaut peut survivre même quand le
 * corps est un FormData selon la version d'axios — ce qui casse le
 * boundary multipart et fait échouer Multer côté serveur ("Aucun fichier
 * fourni"). Avec `fetch` et sans le moindre header `Content-Type` fixé à la
 * main, le navigateur génère lui-même l'en-tête correct avec son boundary.
 * On rattache seulement le token d'authentification manuellement, comme le
 * ferait l'intercepteur d'axios.
 */
async function uploadSingleImage(propertyId: string, file: File): Promise<UploadedImage | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("propertyId", propertyId);

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const res = await fetch(`${API_BASE_URL}/media/image`, {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    body: formData,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || `Erreur upload (${res.status})`);
  }

  const media = extractItem<{
    id?: string;
    url: string;
    title?: string | null;
    isPrimary?: boolean;
  }>(json);

  if (!media?.url) return null;

  return {
    id: media.id,
    url: media.url,
    title: media.title ?? null,
    isPrimary: media.isPrimary ?? false,
  };
}

/** Envoie plusieurs fichiers en parallèle ; un échec individuel n'empêche pas les autres. */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<UploadedImage[]> {
  if (!files || files.length === 0) return [];

  const results = await Promise.all(
    files.map((file) => uploadSingleImage(propertyId, file).catch(() => null))
  );

  return results.filter((img): img is UploadedImage => img !== null);
}

/** Extrait et trie (image principale en premier) les images intégrées dans la réponse /properties. */
export function extractEmbeddedImages(property: {
  media?: any[];
  Media?: any[];
}): UploadedImage[] {
  const list = property?.media ?? property?.Media ?? [];

  if (!Array.isArray(list)) return [];

  return list
    .filter((m) => m && typeof m.url === "string")
    .map((m) => ({
      id: m.id,
      url: m.url,
      title: m.title ?? null,
      isPrimary: !!m.isPrimary,
    }))
    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
}