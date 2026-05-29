import { readJSON, writeJSON, checkAuth } from "@/app/lib/dataStore";

const FILE = "ads.json";

// GET all ads (admin)
export async function GET(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ads = (await readJSON(FILE)) || [];
  return Response.json({ success: true, data: ads });
}

// POST create new ad
export async function POST(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ads = (await readJSON(FILE)) || [];

    const newAd = {
      id: `ad_${Date.now()}`,
      name: body.name || "New Ad",
      position: body.position || "content",
      type: body.type || "image",
      content: body.content || "",
      imageUrl: body.imageUrl || "",
      targetUrl: body.targetUrl || "",
      isActive: body.isActive || false,
      createdAt: new Date().toISOString(),
      impressions: 0,
      clicks: 0,
    };

    ads.push(newAd);
    await writeJSON(FILE, ads);

    return Response.json({ success: true, data: newAd });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PUT update ad
export async function PUT(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ads = (await readJSON(FILE)) || [];
    const index = ads.findIndex((a) => a.id === body.id);

    if (index === -1) {
      return Response.json({ error: "Ad not found" }, { status: 404 });
    }

    ads[index] = { ...ads[index], ...body, id: ads[index].id, createdAt: ads[index].createdAt };
    await writeJSON(FILE, ads);

    return Response.json({ success: true, data: ads[index] });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE ad
export async function DELETE(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    let ads = (await readJSON(FILE)) || [];

    ads = ads.filter((a) => a.id !== id);
    await writeJSON(FILE, ads);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
