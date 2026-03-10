import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_DIR = 'workspace';

const parseExtArg = () => {
  const args = process.argv.slice(2);
  const extIndex = args.indexOf('--ext');
  if (extIndex === -1 || !args[extIndex + 1]) return '.txt';
  let ext = args[extIndex + 1];
  if (!ext.startsWith('.')) ext = '.' + ext;
  return ext;
};

const findByExt = async () => {
  const ext = parseExtArg();
  const rootPath = path.resolve(process.cwd(), WORKSPACE_DIR);

  try {
    const stat = await fs.stat(rootPath);
    if (!stat.isDirectory()) throw new Error('FS operation failed');
  } catch {
    throw new Error('FS operation failed');
  }

  const result = [];
  await walk(rootPath, rootPath, ext, result);

  result.sort((a, b) => a.localeCompare(b));
  for (const p of result) console.log(p);
};

const walk = async (rootPath, currentDir, ext, result) => {
  const dirEntries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const dirent of dirEntries) {
    const fullPath = path.join(currentDir, dirent.name);
    const relPath = path.relative(rootPath, fullPath).split(path.sep).join('/');

    if (dirent.isDirectory()) {
      await walk(rootPath, fullPath, ext, result);
    } else if (dirent.isFile() && path.extname(dirent.name) === ext) {
      result.push(relPath);
    }
  }
};

await findByExt();
