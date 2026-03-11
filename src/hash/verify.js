// const verify = async () => {
//   // Write your code here
//   // Read checksums.json
//   // Calculate SHA256 hash using Streams API
//   // Print result: filename — OK/FAIL
// };

// await verify();
import { createReadStream } from 'fs';
import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';

const CHECKSUMS_FILE = 'checksums.json';
const WORKSPACE_DIR = 'workspace';

const verify = async () => {
  const checksumsPath = path.resolve(process.cwd(), CHECKSUMS_FILE);

  let raw;
  try {
    raw = await fs.readFile(checksumsPath, 'utf-8');
  } catch {
    throw new Error('FS operation failed');
  }

  let checksums;
  try {
    checksums = JSON.parse(raw);
  } catch {
    throw new Error('FS operation failed');
  }

  for (const { file, hash } of checksums) {
    const filePath = path.resolve(process.cwd(), WORKSPACE_DIR, file);

    const ok = await verifyFile(filePath, hash);
    const status = ok ? 'OK' : 'FAIL';
    console.log(`${file} ${status}`);
  }
};

const verifyFile = (filePath, expectedHash) => {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);

    stream.on('error', () => reject(new Error('FS operation failed')));

    stream.on('data', (chunk) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      const actual = hash.digest('hex');
      resolve(actual === expectedHash);
    });
  });
};

await verify();