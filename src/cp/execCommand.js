// const execCommand = () => {
//   // Write your code here
//   // Take command from CLI argument
//   // Spawn child process
//   // Pipe child stdout/stderr to parent stdout/stderr
//   // Pass environment variables
//   // Exit with same code as child
// };

// execCommand();
import { spawn } from 'child_process';

const [,, cmd, ...args] = process.argv;

if (!cmd) {
  console.error('No command provided');
  process.exit(1);
}

const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('error', (err) => {
  console.error('Failed to start process:', err.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
