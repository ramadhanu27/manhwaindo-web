import { generateToken } from "@/app/lib/dataStore";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (username === adminUser && password === adminPass) {
      const token = generateToken(username);
      return Response.json({ success: true, token, username });
    }

    return Response.json({ success: false, error: "Username atau password salah" }, { status: 401 });
  } catch {
    return Response.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
