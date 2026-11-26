import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Copy the pre-rendered infographic to the grader's output directory.
// The image is deterministic: the same bytes on every run.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
const src = join(repoRoot, "entry.png");
const dest = join(outDir, "entry.png");
copyFileSync(src, dest);

// Fail loudly instead of silently shipping a missing or altered file.
if (statSync(dest).size === 0) {
  throw new Error("entry.png was copied but is empty");
}
const hash = (p: string) =>
  createHash("sha256").update(readFileSync(p)).digest("hex");
if (hash(src) !== hash(dest)) {
  throw new Error("entry.png copy does not match the source bytes");
}
