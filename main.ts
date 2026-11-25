// Robot Romance: One-Line Pickup Lines for AI — make.fun entry
// Entry: a joke pickup line aimed at an AI, written to /output/entry.txt.
// Gate: UTF-8 text, 1-200 characters, single line, not only whitespace.
// Judge: head-to-head AI judge; freshness matters — the brief warns against
// worn robot moves (batteries, charging, rebooting), so this line plays on
// prompts and completions instead: the oldest romantic cliche, retold as
// autocomplete.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The line, in two named parts: the premise sets up the speaker as a prompt,
// the punch lands on "complete me" — autocomplete as romance.
export const SETUP = "I must be a prompt, because I can't stop thinking about";
export const PUNCH = "how you'd complete me.";
export const ENTRY = `${SETUP} ${PUNCH}`;

export interface GateReport {
  codePoints: number;
  lines: number;
  sha256: string;
  passes: boolean;
}

export function buildEntry(): string {
  return `${SETUP} ${PUNCH}`;
}

export function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const lines = text.split("\n").length;
  const sha256 = createHash("sha256").update(text, "utf8").digest("hex");
  const passes =
    codePoints >= 1 && codePoints <= 200 && lines === 1 && text.trim().length > 0;
  return { codePoints, lines, sha256, passes };
}

export function verifyWritten(path: string): string {
  const written = readFileSync(path, "utf8");
  if (written !== ENTRY) {
    throw new Error(`written entry differs from ENTRY at ${path}`);
  }
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  const entry = buildEntry();
  writeFileSync(outPath, entry, "utf8");
  const report = validateEntry(entry);
  const writtenSha = verifyWritten(outPath);
  console.log(
    `gate ${report.passes ? "passes" : "fails"}: ${report.codePoints} code points, ${report.lines} line, sha256 ${report.sha256}`,
  );
  console.log(`wrote ${outPath} (sha256 ${writtenSha})`);
  console.log(`verified: ${JSON.stringify(entry)}`);
  if (!report.passes || writtenSha !== report.sha256) process.exit(1);
}

main();
