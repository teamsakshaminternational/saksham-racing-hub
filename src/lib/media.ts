import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";
const cache = new Map<string, string>();

/** Compress any image file to WebP in the browser before upload. */
export async function compressToWebp(file: File, maxSize = 1800, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality),
  );
  if (!blob) throw new Error("Could not compress image");
  return blob;
}

/** Compress + upload, returns the storage path stored in the database. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const blob = await compressToWebp(file);
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp", upsert: false });
  if (error) throw error;
  return path;
}

export async function deleteImage(path: string | null | undefined) {
  if (!path || /^https?:\/\//.test(path)) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

/** Resolve a stored value (external URL or storage path) into a displayable URL. */
export async function resolveMediaUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) return value;
  const cached = cache.get(value);
  if (cached) return cached;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(value, 60 * 60 * 24 * 7);
  if (error || !data?.signedUrl) return null;
  cache.set(value, data.signedUrl);
  return data.signedUrl;
}
