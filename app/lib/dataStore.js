import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readJSON(filename) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeJSON(filename, data) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Simple token generation/verification using ADMIN_SECRET
export function generateToken(username) {
  const secret = process.env.ADMIN_SECRET || "default-secret";
  const payload = `${username}:${Date.now()}`;
  // Simple base64 encoding with secret prefix (not production-grade, but works without DB)
  const token = Buffer.from(`${secret}:${payload}`).toString("base64");
  return token;
}

export function verifyToken(token) {
  try {
    const secret = process.env.ADMIN_SECRET || "default-secret";
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    if (decoded.startsWith(secret + ":")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Check auth from request headers
export function checkAuth(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  return verifyToken(token);
}
