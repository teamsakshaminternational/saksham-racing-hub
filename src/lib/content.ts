import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Row = Record<string, any>;

async function list(table: string, order: { col: string; asc?: boolean }[] = [{ col: "sort_order" }]) {
  let q = supabase.from(table).select("*");
  for (const o of order) q = q.order(o.col, { ascending: o.asc ?? true });
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Row[];
}

export function useTable(table: string, order?: { col: string; asc?: boolean }[]) {
  return useQuery({
    queryKey: ["table", table],
    queryFn: () => list(table, order),
  });
}

export const useGenerations = () => useTable("generations");
export const useGenerationPhotos = () => useTable("generation_photos");
export const useSubteams = () => useTable("subteams");
export const useMembers = () => useTable("members");
export const useAlumni = () => useTable("alumni", [{ col: "batch_year", asc: false }, { col: "sort_order" }]);
export const useSponsors = () => useTable("sponsors");
export const useAchievements = () => useTable("achievements");
export const useBlogPosts = () =>
  useTable("blog_posts", [{ col: "published_at", asc: false }]);

export function groupBy<T extends Row>(rows: T[], key: string) {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const k = String(row[key] ?? "");
    const arr = map.get(k) ?? [];
    arr.push(row);
    map.set(k, arr);
  }
  return map;
}
