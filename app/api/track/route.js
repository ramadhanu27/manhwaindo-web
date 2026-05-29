import { readJSON, writeJSON } from "@/app/lib/dataStore";

const FILE = "hitstats.json";

// POST track a page view
export async function POST(request) {
  try {
    const { page, referrer } = await request.json();

    if (!page) {
      return Response.json({ error: "Missing page" }, { status: 400 });
    }

    const stats = (await readJSON(FILE)) || {
      totalPageViews: 0,
      totalVisitors: 0,
      todayPageViews: 0,
      todayVisitors: 0,
      todayDate: "",
      pages: {},
      daily: {},
      visitors: [],
    };

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Reset daily counters if new day
    if (stats.todayDate !== today) {
      stats.todayPageViews = 0;
      stats.todayVisitors = 0;
      stats.todayDate = today;
      // Keep only last 100 visitor fingerprints
      stats.visitors = [];
    }

    // Generate a simple visitor fingerprint from headers
    const forwarded = request.headers.get("x-forwarded-for") || "";
    const ua = request.headers.get("user-agent") || "";
    const fingerprint = Buffer.from(`${forwarded}:${ua}`).toString("base64").slice(0, 32);

    // Check if this is a new visitor today
    const isNewVisitor = !stats.visitors.includes(fingerprint);
    if (isNewVisitor) {
      stats.visitors.push(fingerprint);
      stats.totalVisitors += 1;
      stats.todayVisitors += 1;
      // Keep visitors list manageable (max 5000)
      if (stats.visitors.length > 5000) {
        stats.visitors = stats.visitors.slice(-5000);
      }
    }

    // Increment page views
    stats.totalPageViews += 1;
    stats.todayPageViews += 1;

    // Track per-page views
    if (!stats.pages) stats.pages = {};
    stats.pages[page] = (stats.pages[page] || 0) + 1;

    // Track daily stats
    if (!stats.daily) stats.daily = {};
    if (!stats.daily[today]) {
      stats.daily[today] = { pageViews: 0, visitors: 0 };
    }
    stats.daily[today].pageViews += 1;
    if (isNewVisitor) {
      stats.daily[today].visitors += 1;
    }

    // Keep only last 90 days of daily data
    const dailyKeys = Object.keys(stats.daily).sort();
    if (dailyKeys.length > 90) {
      for (const key of dailyKeys.slice(0, dailyKeys.length - 90)) {
        delete stats.daily[key];
      }
    }

    // Keep only top 500 pages
    const pageEntries = Object.entries(stats.pages).sort(([, a], [, b]) => b - a);
    if (pageEntries.length > 500) {
      stats.pages = Object.fromEntries(pageEntries.slice(0, 500));
    }

    await writeJSON(FILE, stats);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Track error:", err);
    return Response.json({ error: "Track failed" }, { status: 500 });
  }
}
