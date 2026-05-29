import HomeClient from "./HomeClient";
import { fetchApi } from "./lib/api";

export default async function HomePage() {
  let initialData = null;
  try {
    const res = await fetchApi("home", {}, { next: { revalidate: 300 } });
    if (res.success) {
      initialData = res.data;
    }
  } catch (err) {
    console.error("Failed to fetch home data on server:", err);
  }

  return <HomeClient initialData={initialData} />;
}
