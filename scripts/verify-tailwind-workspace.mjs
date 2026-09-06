import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tailwindPath = join(root, 'src/components/ui/tailwind.css');
const uiRoot = join(root, 'src');
const optionsMainPath = join(root, 'entrypoints/options/main.tsx');

async function collectCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectCssFiles(path)));
    else if (entry.isFile() && entry.name.endsWith('.css')) files.push(path);
  }
  return files;
}

const tailwindSource = await readFile(tailwindPath, 'utf8');
const forbiddenTailwindPatterns = [
  ['@apply', /@apply\b/],
  ['component layer', /@layer\s+components\b/],
  ['!important override', /!important\b/],
];

for (const [label, pattern] of forbiddenTailwindPatterns) {
  if (pattern.test(tailwindSource)) {
    throw new Error(
      `Workspace Tailwind entry must contain only Tailwind directives and theme tokens; found ${label}.`,
    );
  }
}

const cssFiles = await collectCssFiles(uiRoot);
const unexpectedCss = cssFiles.filter(
  (path) => resolve(path) !== resolve(tailwindPath),
);
if (unexpectedCss.length > 0) {
  throw new Error(
    `Component CSS files are not allowed in the extension workspace:\n${unexpectedCss
      .map((path) => `- ${relative(root, path)}`)
      .join('\n')}`,
  );
}

const optionsMain = await readFile(optionsMainPath, 'utf8');
const cssImports = [
  ...optionsMain.matchAll(/import\s+['"]([^'"]+\.css)['"];?/g),
].map((match) => match[1]);
const expectedCssImport = '../../src/components/ui/tailwind.css';
if (cssImports.length !== 1 || cssImports[0] !== expectedCssImport) {
  throw new Error(
    `Options workspace must import only ${expectedCssImport}; found ${cssImports.join(', ') || 'none'}.`,
  );
}
