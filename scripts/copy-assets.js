import fs from 'fs';
import path from 'path';

const filesToCopy = [
  'aboutus.html',
  'contactus.html',
  'disclaimer-page.html',
  'disclaimer.html',
  'privacy-policy.html',
  'terms-and-conditions.html',
  'index_classic.html',
  'delay_classic.html',
  'wealth_classic.html',
  'lumpsum_classic.html',
  'emi_classic.html',
  'hv_classic.html',
  'header.html',
  'footer.html',
  'socialMedia.html',
  'share.html',
  'sponsor.html',
  'style.css',
  'public/manifest.webmanifest',
  'public/manifest.json',
  'public/sw.js',
];

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

filesToCopy.forEach((file) => {
  if (fs.existsSync(file)) {
    const filename = path.basename(file);
    const dest = path.join(distDir, filename);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(file, dest);
    }
  }
});

const jsDir = path.resolve('js');
const destJsDir = path.join(distDir, 'js');
if (fs.existsSync(jsDir)) {
  fs.cpSync(jsDir, destJsDir, { recursive: true });
}

const iconsDir = path.resolve('public/icons');
const destIconsDir = path.join(distDir, 'icons');
if (fs.existsSync(iconsDir)) {
  fs.cpSync(iconsDir, destIconsDir, { recursive: true });
}

console.log('Static auxiliary & PWA assets successfully synced to dist');
