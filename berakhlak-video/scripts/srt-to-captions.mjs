#!/usr/bin/env node
/**
 * SRT (batas kalimat dari Edge TTS) -> src/data/captions.ts
 *
 * Catatan penting: `--write-subtitles` Edge TTS menghasilkan cue PER KALIMAT,
 * bukan per kata. Jadi script ini melakukan dua hal:
 *   1. MENGGABUNG cue pendek yang berdekatan supaya tidak berkedip-kedip;
 *   2. MEMECAH cue panjang di batas kata, karena satu kalimat utuh
 *      (mis. 140 karakter / 11 detik) tidak layak dibaca sebagai satu subtitle.
 *
 * Waktu hasil pemecahan dibagi proporsional menurut jumlah karakter — laju
 * tutur Edge TTS cukup rata sehingga perkiraan ini akurat dalam praktik.
 *
 * Output: src/data/captions.ts — Caption[] per scene.
 */
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const narration = JSON.parse(readFileSync(join(root, 'src/data/narration.json'), 'utf8'));

/** Batas panjang satu subtitle. 62 karakter ≈ 1050px @34px — masih satu baris. */
const MAX_CHARS = 62;
/** Batas durasi satu subtitle. */
const MAX_MS = 4800;
/** Jeda antar-cue yang dianggap batas kalimat saat menggabung. */
const GAP_MS = 220;
/** Jeda kecil antar potongan hasil pemecahan, supaya pergantian teks terlihat. */
const SPLIT_GAP_MS = 70;

const tsToMs = (ts) => {
  const m = ts.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  return (+m[1] * 3600 + +m[2] * 60 + +m[3]) * 1000 + +m[4];
};

const parseSrt = (srt) =>
  srt
    .replace(/\r/g, '')
    .split(/\n\n+/)
    .map((block) => {
      const lines = block.split('\n').filter((l) => l.trim() !== '');
      const timeLine = lines.find((l) => l.includes('-->'));
      if (!timeLine) return null;
      const [from, to] = timeLine.split('-->');
      const text = lines
        .filter((l) => l !== timeLine && !/^\d+$/.test(l.trim()))
        .join(' ')
        .trim();
      if (!text) return null;
      return {text, startMs: tsToMs(from), endMs: tsToMs(to)};
    })
    .filter(Boolean);

const mergeCues = (cues) => {
  const out = [];
  let cur = null;
  for (const cue of cues) {
    if (!cur) {
      cur = {...cue};
      continue;
    }
    const gap = cue.startMs - cur.endMs;
    const wouldBe = `${cur.text} ${cue.text}`;
    const tooLong = wouldBe.length > MAX_CHARS;
    const tooSlow = cue.endMs - cur.startMs > MAX_MS;
    const endsSentence = /[.!?]$/.test(cur.text.trim());
    if (gap > GAP_MS || tooLong || tooSlow || endsSentence) {
      out.push(cur);
      cur = {...cue};
    } else {
      cur = {text: wouldBe, startMs: cur.startMs, endMs: cue.endMs};
    }
  }
  if (cur) out.push(cur);
  return out;
};

/** Bagi kata menjadi potongan yang tidak melewati batas karakter. */
const chunkWords = (words, maxChars) => {
  const chunks = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      chunks.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
};

/** Pecah caption yang terlalu panjang / terlalu lama, lalu bagi waktunya. */
const splitLong = (cap) => {
  const dur = cap.endMs - cap.startMs;
  if (cap.text.length <= MAX_CHARS && dur <= MAX_MS) return [cap];

  const words = cap.text.split(' ');

  // Pecah dengan batas karakter, lalu sempitkan batas itu sampai tidak ada
  // potongan yang melewati MAX_MS. Laju tutur Edge TTS tidak persis rata
  // (daftar bernomor lebih lambat), jadi durasi juga ikut dijadikan patokan.
  let maxChars = MAX_CHARS;
  let chunks = chunkWords(words, maxChars);

  if (chunks.length === 1 && dur > MAX_MS && words.length > 3) {
    maxChars = Math.max(14, Math.ceil(cap.text.length / Math.ceil(dur / MAX_MS)));
    chunks = chunkWords(words, maxChars);
  }

  let guard = 0;
  while (chunks.length > 1 && dur / chunks.length > MAX_MS && maxChars > 14 && guard++ < 12) {
    maxChars = Math.max(14, Math.floor(maxChars * 0.8));
    chunks = chunkWords(words, maxChars);
  }

  if (chunks.length <= 1) return [cap];

  const totalChars = chunks.reduce((a, c) => a + c.length, 0);
  const out = [];
  let cursor = cap.startMs;

  chunks.forEach((text, i) => {
    const isLast = i === chunks.length - 1;
    const share = isLast
      ? cap.endMs - cursor
      : Math.max(600, Math.round((text.length / totalChars) * dur));
    const start = cursor;
    const end = isLast ? cap.endMs : Math.min(start + share, cap.endMs);
    // beri jeda kecil di ujung potongan (bukan di awal) agar teks terlihat berganti
    out.push({text, startMs: Math.round(start), endMs: Math.round(isLast ? end : end - SPLIT_GAP_MS)});
    cursor = end;
  });

  return out.filter((c) => c.endMs > c.startMs);
};

const entries = [];
for (const id of narration.order) {
  const srtPath = join(root, 'public/voiceover', `${id}.srt`);
  if (!existsSync(srtPath)) {
    console.warn(`! ${id}.srt tidak ada — dilewati`);
    continue;
  }
  const cues = parseSrt(readFileSync(srtPath, 'utf8'));
  entries.push([id, mergeCues(cues).flatMap(splitLong)]);
}

const header = `// DIHASILKAN OTOMATIS oleh scripts/srt-to-captions.mjs — jangan diubah manual.
// Subtitle per scene, disinkronkan dari batas kalimat Edge TTS lalu dipecah
// di batas kata (MAX ${MAX_CHARS} karakter / ${MAX_MS} ms per baris).

export type Caption = {
  text: string;
  startMs: number;
  endMs: number;
};

`;

const body = entries
  .map(([id, caps]) => {
    const items = caps
      .map((c) => `    {text: ${JSON.stringify(c.text)}, startMs: ${c.startMs}, endMs: ${c.endMs}},`)
      .join('\n');
    return `  ${JSON.stringify(id)}: [\n${items}\n  ],`;
  })
  .join('\n');

const footer = `\n\nexport const captionsByScene: Record<string, Caption[]> = {\n${body}\n};\n`;

writeFileSync(join(root, 'src/data/captions.ts'), header + footer);
console.log(
  `captions.ts ditulis: ${entries.length} scene, ${entries.reduce((a, [, c]) => a + c.length, 0)} baris`,
);
for (const [id, caps] of entries) {
  const longest = caps.reduce((a, c) => Math.max(a, c.text.length), 0);
  const slowest = caps.reduce((a, c) => Math.max(a, c.endMs - c.startMs), 0);
  console.log(
    `  ${id.padEnd(9)} ${String(caps.length).padStart(2)} baris  terpanjang ${String(longest).padStart(3)} char  terlama ${(slowest / 1000).toFixed(1)}s`,
  );
}
