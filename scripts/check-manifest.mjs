// Проверка mapp/mapp.manifest.json перед публикацией.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../mapp/', import.meta.url).pathname;
const m = JSON.parse(readFileSync(join(root, 'mapp.manifest.json'), 'utf8'));
const errors = [];
for (const k of ['id', 'name', 'version', 'author']) if (!m[k]) errors.push(`нет поля ${k}`);
if (m.id && !/^[a-z0-9-]+\.[a-z0-9-]+$/i.test(m.id)) errors.push('id должен быть вида author.app-name');
if (m.icon && !existsSync(join(root, m.icon))) errors.push(`нет иконки ${m.icon}`);
if (!existsSync(join(root, 'public', 'index.html'))) errors.push('нет public/index.html');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`OK: ${m.id}@${m.version}`);
