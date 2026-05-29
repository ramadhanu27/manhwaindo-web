import { readJSON } from "@/app/lib/dataStore";

// GET active ads for public display
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const position = searchParams.get("position");

  const ads = (await readJSON("ads.json")) || [];
  let activeAds = ads.filter((a) => a.isActive);

  if (position) {
    activeAds = activeAds.filter((a) => a.position === position);
  }

  return Response.json(
    {
      success: true,
      data: activeAds.map((a) => ({
        id: a.id,
        name: a.name,
        position: a.position,
        type: a.type,
        content: a.content,
        imageUrl: a.imageUrl,
        targetUrl: a.targetUrl,
      })),
    },
    {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    },
  );
}
