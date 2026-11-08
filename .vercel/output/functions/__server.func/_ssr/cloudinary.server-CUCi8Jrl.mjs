import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
//#region node_modules/.nitro/vite/services/ssr/assets/cloudinary.server-CUCi8Jrl.js
var CLOUD_NAME = "f4iuzezb";
var CLOUD_API_KEY = "361377871219586";
var CLOUD_API_SECRET = "0SsJAD0kmO0Kr94PO3kyl1OWuAU";
function secretFromEnvFile() {
	const paths = [
		".env",
		"/workspace/.env",
		join(dirname(fileURLToPath(import.meta.url)), "../../.env")
	];
	for (const path of paths) try {
		const value = readFileSync(path, "utf8").split("\n").find((row) => row.startsWith("CLOUDINARY_API_SECRET="))?.slice(22).trim();
		if (value) return value;
	} catch {}
	return "";
}
function signVideoUpload() {
	const secret = process.env.CLOUDINARY_API_SECRET?.trim() || secretFromEnvFile() || CLOUD_API_SECRET;
	const timestamp = Math.floor(Date.now() / 1e3);
	return {
		cloudName: CLOUD_NAME,
		apiKey: CLOUD_API_KEY,
		timestamp,
		signature: createHash("sha1").update(`timestamp=${timestamp}${secret}`).digest("hex")
	};
}
//#endregion
export { signVideoUpload };
