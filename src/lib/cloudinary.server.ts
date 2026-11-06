import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const CLOUD_NAME = "f4iuzezb";
export const CLOUD_API_KEY = "361377871219586";
const CLOUD_API_SECRET = "0SsJAD0kmO0Kr94PO3kyl1OWuAU";

function secretFromEnvFile() {
  const paths = [
    ".env",
    "/workspace/.env",
    join(dirname(fileURLToPath(import.meta.url)), "../../.env"),
  ];
  for (const path of paths) {
    try {
      const text = readFileSync(path, "utf8");
      const line = text.split("\n").find((row) => row.startsWith("CLOUDINARY_API_SECRET="));
      const value = line?.slice("CLOUDINARY_API_SECRET=".length).trim();
      if (value) return value;
    } catch {
      /* try the next location */
    }
  }
  return "";
}

export function signVideoUpload() {
  const secret = process.env.CLOUDINARY_API_SECRET?.trim() || secretFromEnvFile() || CLOUD_API_SECRET;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`timestamp=${timestamp}${secret}`).digest("hex");
  return { cloudName: CLOUD_NAME, apiKey: CLOUD_API_KEY, timestamp, signature };
}
