import { promises as fs } from 'fs';
import path from 'path';

const SNAPSHOT_FILE = 'snapshot.json';
const RESTORED_DIR = 'workspace_restored';

const restoreFromSnapshot = async () => {
  const snapshotPath = path.resolve(process.cwd(), SNAPSHOT_FILE);

  let snapshotRaw;
  try {
    snapshotRaw = await fs.readFile(snapshotPath, 'utf-8');
  } catch {
    throw new Error('FS operation failed');
  }

  let snapshot;
  try {
    snapshot = JSON.parse(snapshotRaw);
  } catch {
    throw new Error('FS operation failed');
  }

  const restoredRoot = path.resolve(process.cwd(), RESTORED_DIR);

  try {
    await fs.stat(restoredRoot);
    throw new Error('FS operation failed');
  } catch (err) {
    if (err.message === 'FS operation failed') throw err;
    if (err.code !== 'ENOENT') throw new Error('FS operation failed');
  }

  await fs.mkdir(restoredRoot, { recursive: true });

  for (const entry of snapshot.entries) {
    const targetPath = path.join(restoredRoot, entry.path);
    if (entry.type === 'directory') {
      await fs.mkdir(targetPath, { recursive: true });
    } else if (entry.type === 'file') {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, Buffer.from(entry.content, 'base64'));
    }
  }
};

await restoreFromSnapshot();