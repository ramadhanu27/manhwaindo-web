import ManhwaListClient from "./ManhwaListClient";

// Parse path segments into filter object
// /manhwa/genre/action/status/ongoing/type/manga/order/popular/page/2
function parseFilters(segments = []) {
  const filters = {};
  const validKeys = ["genre", "status", "type", "order", "search", "page"];

  for (let i = 0; i < segments.length; i += 2) {
    const key = segments[i];
    const value = segments[i + 1];
    if (validKeys.includes(key) && value) {
      filters[key] = decodeURIComponent(value);
    }
  }
  return filters;
}

export async function generateMetadata({ params }) {
  const { filters } = await params;
  const parsed = parseFilters(filters);

  const parts = [];
  if (parsed.search) parts.push(`"${parsed.search}"`);
  if (parsed.genre)
    parts.push(
      parsed.genre
        .split(",")
        .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
        .join(", "),
    );
  if (parsed.type) parts.push(parsed.type.charAt(0).toUpperCase() + parsed.type.slice(1));
  if (parsed.status) parts.push(parsed.status.charAt(0).toUpperCase() + parsed.status.slice(1));
  if (parsed.order === "rating") parts.push("Rating Tertinggi");
  else if (parsed.order === "views") parts.push("Terpopuler");
  else if (parsed.order === "title") parts.push("A-Z");

  const title = parts.length > 0 ? `Komik ${parts.join(" ")}` : "Daftar Komik";
  const description =
    parts.length > 0
      ? `Baca komik ${parts.join(", ")} online gratis bahasa Indonesia di ManhwaIndo. Koleksi terlengkap & update tercepat.`
      : "Jelajahi koleksi lengkap manhwa, manga, dan manhua di ManhwaIndo. Filter berdasarkan genre, status, tipe, dan rating.";

  return {
    title,
    description,
  };
}

export default async function ManhwaListPage({ params }) {
  const { filters } = await params;
  const parsed = parseFilters(filters);

  return (
    <ManhwaListClient
      initialGenre={parsed.genre || ""}
      initialStatus={parsed.status || ""}
      initialType={parsed.type || ""}
      initialOrderby={parsed.order || "latest"}
      initialSearch={parsed.search || ""}
      initialPage={Number(parsed.page) || 1}
    />
  );
}
