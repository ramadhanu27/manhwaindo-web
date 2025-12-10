import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "popup.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ enabled: false });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading popup config:", error);
    return NextResponse.json({ enabled: false });
  }
}
