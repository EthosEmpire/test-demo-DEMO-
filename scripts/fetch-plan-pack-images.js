#!/usr/bin/env node
/*
 * scripts/fetch-plan-pack-images.js
 *
 * One-time helper that downloads curated free-stock images for the
 * Plan Packs system and converts them to .webp inside images/plan-packs/.
 *
 * Why it exists:
 *   Stage 35-A added image fields (coverImage / heroImage / lessonImage)
 *   to PACK_CONTENT_OVERLAY in dashboard/dashboard.js. The rendered UI
 *   expects files like:
 *     images/plan-packs/cards/youtube-launch-cover.webp
 *     images/plan-packs/lessons/youtube-launch-day-01.webp
 *
 *   This script populates those files. It is safe to re-run — already
 *   downloaded files are skipped unless --force is passed.
 *
 * Image sources:
 *   Unsplash photos with stable image-CDN URLs. The Unsplash License
 *   permits commercial use without attribution; attribution is documented
 *   in the IMAGE_CREDITS map below regardless.
 *
 * Requirements:
 *   - Node 18+
 *   - sharp:  npm install --no-save sharp
 *   - Internet access
 *
 * Usage:
 *   npm install --no-save sharp
 *   node scripts/fetch-plan-pack-images.js
 *   node scripts/fetch-plan-pack-images.js --force   # re-download all
 *
 * Notes:
 *   - This script is checked in so the user can re-run it after adding
 *     new packs.
 *   - It does NOT install sharp automatically (it would alter the
 *     project's dependency tree). Run the npm install line above first.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const FORCE = process.argv.includes('--force');
const ROOT  = path.resolve(__dirname, '..');
const CARDS_DIR   = path.join(ROOT, 'images', 'plan-packs', 'cards');
const LESSONS_DIR = path.join(ROOT, 'images', 'plan-packs', 'lessons');

/* ─────────────────────────────────────────────────────────────────────
   IMAGE MAP — pack_id → { cover, hero?, lessons?: {n: url} }
   All URLs are direct Unsplash image-CDN URLs (stable). Add ?w=1600&q=80
   so the source download is reasonable; sharp downsizes per output.
   ─────────────────────────────────────────────────────────────────── */
const IMAGES = {
  /* Active packs — cover + hero + first few lessons */
  'side-business': {
    cover:  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80',
    hero:   'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80',
    lessons: {
       1: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&q=80',
       2: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80',
       3: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1600&q=80',
       4: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=1600&q=80',
       5: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80',
       6: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&q=80',
       7: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80',
       8: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80',
       9: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1600&q=80',
      10: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80',
      11: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1600&q=80',
      12: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80',
      13: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80',
      14: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=80'
    }
  },
  'youtube-launch': {
    cover:  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1600&q=80',
    hero:   'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1600&q=80',
    lessons: {
       1: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1600&q=80',
       2: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?w=1600&q=80',
       3: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80',
       4: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=1600&q=80',
       5: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80',
       6: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1600&q=80',
       7: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
       8: 'https://images.unsplash.com/photo-1574717024788-7e3786cf1a6c?w=1600&q=80',
       9: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=1600&q=80',
      10: 'https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=1600&q=80',
      11: 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=1600&q=80',
      12: 'https://images.unsplash.com/photo-1500336624523-d727130c3328?w=1600&q=80',
      13: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1600&q=80',
      14: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?w=1600&q=80'
    }
  },

  /* Active packs (cover-only for now; lessons stay on text content) */
  'morning-mastery':    { cover: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1600&q=80' },
  'clear-skin':         { cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=80' },
  'hair-care':          { cover: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&q=80' },
  'business-idea':      { cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80' },
  'content-plan':       { cover: 'https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f?w=1600&q=80' },
  'focus-builder':      { cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80' },
  'style-foundations':  { cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80' },

  /* Coming-soon packs (covers staged so badges look polished) */
  'financial-blueprint':{ cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80' },
  'mindset-reboot':     { cover: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80' },
  'body-architect':     { cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80' },
  'business-builder':   { cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80' },
  'social-mastery':     { cover: 'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=1600&q=80' }
};

/* Attribution kept for license clarity. The Unsplash License does not
   require attribution but it is good practice and helps audit later. */
const IMAGE_CREDITS = '/* Source: unsplash.com — Unsplash License (free, commercial use OK). */';

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function downloadBuffer(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
      }
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end',  function ()  { resolve(Buffer.concat(chunks)); });
    }).on('error', reject);
  });
}

function pad2(n) { return n < 10 ? '0' + n : String(n); }

async function processOne(packId, kind, url, dayNum) {
  var sharp; try { sharp = require('sharp'); } catch (e) {
    throw new Error('sharp not installed. Run: npm install --no-save sharp');
  }
  var dir, name, width;
  if (kind === 'cover') {
    dir = CARDS_DIR;   name = packId + '-cover.webp';                          width = 960;
  } else if (kind === 'hero') {
    dir = LESSONS_DIR; name = packId + '-hero.webp';                           width = 1600;
  } else {
    dir = LESSONS_DIR; name = packId + '-day-' + pad2(dayNum) + '.webp';       width = 1600;
  }
  ensureDir(dir);
  var outPath = path.join(dir, name);
  if (!FORCE && fs.existsSync(outPath)) {
    console.log('skip (exists): ' + path.relative(ROOT, outPath));
    return;
  }
  console.log('fetch: ' + name + '   <- ' + url);
  var buf = await downloadBuffer(url);
  await sharp(buf).resize({ width: width, withoutEnlargement: true })
                  .webp({ quality: 78 })
                  .toFile(outPath);
  console.log('  wrote: ' + path.relative(ROOT, outPath));
}

async function main() {
  ensureDir(CARDS_DIR); ensureDir(LESSONS_DIR);
  console.log(IMAGE_CREDITS);
  var tasks = [];
  Object.keys(IMAGES).forEach(function (packId) {
    var pack = IMAGES[packId];
    if (pack.cover) tasks.push(['cover', packId, pack.cover, null]);
    if (pack.hero)  tasks.push(['hero',  packId, pack.hero,  null]);
    if (pack.lessons) Object.keys(pack.lessons).forEach(function (n) {
      tasks.push(['lesson', packId, pack.lessons[n], Number(n)]);
    });
  });
  console.log('Total images: ' + tasks.length);
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    try { await processOne(t[1], t[0], t[2], t[3]); }
    catch (e) { console.error('ERROR ' + t[1] + '/' + t[0] + ' day=' + t[3] + ': ' + e.message); }
  }
  console.log('Done.');
}

main();
