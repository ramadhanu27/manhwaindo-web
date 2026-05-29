import DetailClient from "./DetailClient";
import { fetchApi } from "@/app/lib/api";

export default async function ManhwaDetailPage({ params }) {
  const { slug } = await params;
  let initialData = null;
  try {
    const res = await fetchApi(`manhwa/${slug}`, {}, { next: { revalidate: 180 } });
    if (res.success) {
      initialData = res.data;
    }
  } catch (err) {
    console.error("Failed to fetch detail on server:", err);
  }

  return <DetailClient initialData={initialData} slug={slug} />;
}
