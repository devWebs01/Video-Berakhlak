#!/usr/bin/env node
/**
 * Penjaga keseimbangan footage.
 *
 * Memeriksa satu syarat yang mudah dilanggar dan tidak terlihat sampai render:
 *   jumlah durasi footage tersedia per scene  >  durasi scene
 *
 * Kalau syarat ini dilanggar, klip kehabisan gambar dan panel membeku di frame
 * terakhir. Bug ini pernah terjadi (satu klip hanya 2,8 dtk untuk slot 9 dtk),
 * karena itu diperiksa otomatis di sini.
 *
 * Script ini sengaja gagal keras kalau pola berkasnya tidak lagi cocok,
 * supaya tidak pernah memberi "lulus" palsu.
 *
 * Pemakaian: node scripts/check-shots.mjs
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
const OVERLAP = 15;
const TAIL = 15;
/** Panel Outro hanya tampil sampai kartu akhir masuk (62% scene). */
const OUTRO_VISIBLE = 0.62;

const read = (p) => readFileSync(join(root, p), 'utf8');

// --- durasi audio -> durasi scene -------------------------------------------
const durSrc = read('src/data/durations.ts');
const audioSeconds = {};
for (const m of durSrc.matchAll(/'([^']+)':\s*([\d.]+)/g)) {
  audioSeconds[m[1]] = Number(m[2]);
}
if (Object.keys(audioSeconds).length === 0) {
  console.error('GAGAL: tidak ada durasi audio yang terbaca dari src/data/durations.ts');
  process.exit(1);
}

// --- scene & klip -----------------------------------------------------------
const shotsSrc = read('src/data/shots.ts');
const sceneBlock = /^ {2}(?:'([^']+)'|([A-Za-z0-9_-]+)):\s*\{/gm;
const marks = [];
for (const m of shotsSrc.matchAll(sceneBlock)) {
  marks.push({id: m[1] ?? m[2], index: m.index});
}
if (marks.length === 0) {
  console.error('GAGAL: tidak ada scene yang terbaca dari src/data/shots.ts');
  process.exit(1);
}

const scenes = marks.map((mark, i) => {
  const end = i + 1 < marks.length ? marks[i + 1].index : shotsSrc.length;
  const body = shotsSrc.slice(mark.index, end);
  const clips = [];
  for (const m of body.matchAll(/\bs\(\s*'([^']+)'\s*,\s*([\d.]+)\s*,/g)) {
    clips.push({file: m[1], seconds: Number(m[2])});
  }
  return {...mark, clips};
});

// --- periksa ----------------------------------------------------------------
let failed = false;
const seen = new Map();
const declaredSeconds = new Map();
const rows = [];

for (const scene of scenes) {
  const audio = audioSeconds[scene.id];
  if (audio === undefined) {
    console.error(`GAGAL: scene "${scene.id}" tidak punya durasi audio`);
    failed = true;
    continue;
  }

  const sceneFrames = Math.ceil(audio * FPS) + OVERLAP + TAIL;
  const needFrames =
    scene.id === 'outro'
      ? Math.min(sceneFrames, Math.round(sceneFrames * OUTRO_VISIBLE) + 10)
      : sceneFrames;

  const available = scene.clips.reduce((a, c) => a + c.seconds * FPS, 0);
  const ok = available >= needFrames;
  if (!ok) failed = true;

  for (const c of scene.clips) {
    if (!seen.has(c.file)) seen.set(c.file, []);
    seen.get(c.file).push(scene.id);
    if (!declaredSeconds.has(c.file)) declaredSeconds.set(c.file, c.seconds);
  }

  rows.push({
    id: scene.id,
    clips: scene.clips.length,
    need: (needFrames / FPS).toFixed(2),
    have: (available / FPS).toFixed(2),
    slack: ((available - needFrames) / FPS).toFixed(2),
    ok,
  });
}

const w = Math.max(...rows.map((r) => r.id.length), 4);
console.log(`${'scene'.padEnd(w)}  klip    butuh   tersedia   sisa  status`);
console.log('-'.repeat(w + 40));
for (const r of rows) {
  console.log(
    `${r.id.padEnd(w)}  ${String(r.clips).padStart(4)}  ${r.need.padStart(6)}s  ${r.have.padStart(7)}s  ${r.slack.padStart(5)}s  ${r.ok ? 'ok' : 'KURANG'}`,
  );
}

const reused = [...seen.entries()].filter(([, v]) => v.length > 1);
console.log(
  `\n${seen.size} klip dipakai${reused.length ? `; dipakai ulang: ${reused.map(([f, v]) => `${f} (${v.join(', ')})`).join('; ')}` : '; tidak ada yang dipakai ulang'}`,
);

// --- verifikasi angka `seconds` terhadap berkas proxy yang sebenarnya --------
// `seconds` di shots.ts adalah batas atas yang dipakai Broll. Kalau angkanya
// lebih besar daripada berkas aslinya, footage akan kurang dan panel membeku.
const TOL = 0.12;
const mismatched = [];
for (const [file, declared] of declaredSeconds) {
  const path = join(root, 'public/clips', `${file}.mp4`);
  if (!existsSync(path)) {
    mismatched.push(`${file.padEnd(18)} proxy TIDAK ADA (public/clips/${file}.mp4)`);
    continue;
  }
  const raw = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', path],
    {encoding: 'utf8'},
  );
  const actual = Number(raw.trim());
  if (!Number.isFinite(actual)) {
    mismatched.push(`${file.padEnd(18)} durasi tidak terbaca dari ffprobe`);
    continue;
  }
  const diff = actual - declared;
  if (Math.abs(diff) > TOL) {
    mismatched.push(
      `${file.padEnd(18)} shots.ts: ${declared}s  proxy: ${actual.toFixed(2)}s  (selisih ${diff > 0 ? '+' : ''}${diff.toFixed(2)}s)`,
    );
  }
}

if (mismatched.length) {
  failed = true;
  console.error('\nANGKA `seconds` TIDAK COCOK DENGAN PROXY:');
  for (const line of mismatched) console.error(`  ${line}`);
  console.error('  Perbaiki `seconds` di src/data/shots.ts (atau encode ulang proxynya).');
} else {
  console.log(`\n${declaredSeconds.size} angka \`seconds\` cocok dengan durasi proxy di disk.`);
}

if (failed) {
  console.error('\nGAGAL: ada scene yang footage-nya kurang. Tambah klip atau pendekkan scene.');
  process.exit(1);
}
console.log('\nLULUS: semua scene punya cukup footage.');
