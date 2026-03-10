import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_DIR = 'workspace';
const SNAPSHOT_FILE = 'snapshot.json';

const createSnapshot = async () => {
  const rootPath = path.resolve(process.cwd(), WORKSPACE_DIR);

  let stat;
  try {
    stat = await fs.stat(rootPath);
  } catch {
    throw new Error('FS operation failed');
  }

  if (!stat.isDirectory()) {
    throw new Error('FS operation failed');
  }

  const entries = [];
  await walkDir(rootPath, rootPath, entries);

  const snapshot = { rootPath, entries };

  const snapshotPath = path.resolve(process.cwd(), SNAPSHOT_FILE);
  await fs.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8');
};

const walkDir = async (rootPath, currentDir, entries) => {
  const dirEntries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const dirent of dirEntries) {
    const fullPath = path.join(currentDir, dirent.name);
    const relPath = path.relative(rootPath, fullPath).split(path.sep).join('/');

    if (dirent.isDirectory()) {
      entries.push({ path: relPath, type: 'directory' });
      await walkDir(rootPath, fullPath, entries);
    } else if (dirent.isFile()) {
      const stat = await fs.stat(fullPath);
      const buf = await fs.readFile(fullPath);
      entries.push({
        path: relPath,
        type: 'file',
        size: stat.size,
        content: buf.toString('base64'),
      });
    }
  }
};

await createSnapshot();