import fs from 'fs';
import path from 'path';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyRecursiveSync(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log("Menyalin aset statis ke document root untuk LiteSpeed Hostinger...");

// Copy .next/static → _next/static di root
// Supaya LiteSpeed bisa serve /_next/static/* langsung dari filesystem
const dest = path.join('_next', 'static');
copyRecursiveSync(path.join('.next', 'static'), dest);

console.log("Selesai: aset statis tersedia di _next/static/");

