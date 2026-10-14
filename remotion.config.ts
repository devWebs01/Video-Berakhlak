/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

/**
 * Chrome di mesin ini.
 *
 * Bawaan Remotion 4 adalah `chrome-mode=headless-shell`, yang mengunduh biner
 * terpisah. Di mesin ini biner itu sudah terunduh tetapi gagal diluncurkan
 * (`chrome_crashpad_handler: --database is required`). Mode
 * `chrome-for-testing` juga sudah dicoba dan gagal dengan gejala yang sama.
 * Chrome sistem ada dan berjalan normal, jadi itu yang dipakai.
 *
 * Urutannya sengaja: variabel lingkungan dulu supaya jalur bisa ditimpa tanpa
 * menyunting berkas ini, lalu lokasi baku di Arch/Debian. Kalau tidak satu pun
 * ada, biarkan Remotion memakai bawaannya (unduh sendiri).
 */
const KANDIDAT_CHROME = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter((p): p is string => Boolean(p));

const chrome = KANDIDAT_CHROME.find((p) => existsSync(p));
if (chrome) {
  Config.setBrowserExecutable(chrome);
}

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
