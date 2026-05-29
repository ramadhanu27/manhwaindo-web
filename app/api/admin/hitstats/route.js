import { readJSON, writeJSON, checkAuth } from "@/app/lib/dataStore";

const FILE = "hitstats.json";

// GET hitstats (admin)
export async function GET(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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

  // Calculate top pages
  const topPages = Object.entries(stats.pages || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([path, views]) => ({ path, views }));

  // Last 30 days of daily data
  const dailyData = Object.entries(stats.daily || {})
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 30)
    .map(([date, data]) => ({ date, ...data }));

  return Response.json({
    success: true,
    data: {
      totalPageViews: stats.totalPageViews || 0,
      totalVisitors: stats.totalVisitors || 0,
      todayPageViews: stats.todayPageViews || 0,
      todayVisitors: stats.todayVisitors || 0,
      topPages,
      dailyData,
    },
  });
}

// DELETE reset stats (admin)
export async function DELETE(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const freshStats = {
    totalPageViews: 0,
    totalVisitors: 0,
    todayPageViews: 0,
    todayVisitors: 0,
    todayDate: "",
    pages: {},
    daily: {},
    visitors: [],
  };

  await writeJSON(FILE, freshStats);
  return Response.json({ success: true, message: "Stats reset" });
}
