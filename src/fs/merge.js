// const merge = async () => {
//   // Write your code here
//   // Default: read all .txt files from workspace/parts in alphabetical order
//   // Optional: support --files filename1,filename2,... to merge specific files in provided order
//   // Concatenate content and write to workspace/merged.txt
// };

// await merge();


import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_DIR = 'workspace';
const PARTS_DIR = 'parts';
const OUTPUT_FILE = 'merged.txt';

const parseFilesArg = () => {
  const args = process.argv.slice(2);
  const filesIndex = args.indexOf('--files');
  if (filesIndex === -1) return null;
  const files = [];
  for (let i = filesIndex + 1; i < args.length; i++) {
    if (args[i].startsWith('--')) break;
    files.push(args[i]);
  }
  return files.length > 0 ? files : null;
};

const mergeFiles = async () => {
  const partsPath = path.resolve(process.cwd(), WORKSPACE_DIR, PARTS_DIR);

  try {
    const stat = await fs.stat(partsPath);
    if (!stat.isDirectory()) throw new Error('FS operation failed');
  } catch {
    throw new Error('FS operation failed');
  }

  const explicitFiles = parseFilesArg();
  let filesToMerge;

  if (explicitFiles) {
    filesToMerge = explicitFiles.map((name) => path.join(partsPath, name));
    for (const fp of filesToMerge) {
      try {
        const st = await fs.stat(fp);
        if (!st.isFile()) throw new Error('FS operation failed');
      } catch {
        throw new Error('FS operation failed');
      }
    }
  } else {
    const dirEntries = await fs.readdir(partsPath, { withFileTypes: true });
    const txtFiles = dirEntries
      .filter((d) => d.isFile() && path.extname(d.name) === '.txt')
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b));

    if (txtFiles.length === 0) throw new Error('FS operation failed');
    filesToMerge = txtFiles.map((name) => path.join(partsPath, name));
  }

  let result = '';
  for (const fp of filesToMerge) {
    result += await fs.readFile(fp, 'utf-8');
  }

  await fs.writeFile(
    path.resolve(process.cwd(), WORKSPACE_DIR, OUTPUT_FILE),
    result,
    'utf-8'
  );
};

await mergeFiles();
