import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcIconsDir = join(root, 'src/icons');
const distIconsDir = join(root, 'dist/icons');

await mkdir(distIconsDir, { recursive: true });

const iconFiles = (await readdir(srcIconsDir))
  .filter((file) => file.endsWith('.svg'))
  .sort();

await Promise.all(iconFiles.map((file) => (
  copyFile(join(srcIconsDir, file), join(distIconsDir, file))
)));

await copyFile(
  join(srcIconsDir, 'react-icons.d.ts'),
  join(root, 'dist/icons.d.ts'),
);

console.log(`Copied ${iconFiles.length} icon SVGs and dist/icons.d.ts`);
