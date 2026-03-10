// const progress = () => {
//   // Write your code here
//   // Simulate progress bar from 0% to 100% over ~5 seconds
//   // Update in place using \r every 100ms
//   // Format: [████████████████████          ] 67%
// };

// progress();
const TOTAL = 100;
const BAR_LENGTH = 40;
const INTERVAL_MS = 100;

let current = 0;

const renderBar = (percent) => {
  const filled = Math.round((percent / 100) * BAR_LENGTH);
  const empty = BAR_LENGTH - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  process.stdout.write(`\r[${bar}] ${percent}%`);
};

const timer = setInterval(() => {
  current++;
  renderBar(current);

  if (current >= TOTAL) {
    clearInterval(timer);
    process.stdout.write('\nDone!\n');
  }
}, INTERVAL_MS);
