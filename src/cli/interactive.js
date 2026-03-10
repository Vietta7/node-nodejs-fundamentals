// const interactive = () => {
//   // Write your code here
//   // Use readline module for interactive CLI
//   // Support commands: uptime, cwd, date, exit
//   // Handle Ctrl+C and unknown commands
// };

// interactive();

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const printHelp = () => {
  console.log('Available commands:');
  console.log('  add <name> - Add a new item');
  console.log('  list       - List all items');
  console.log('  delete <name> - Delete an item');
  console.log('  exit       - Exit the program');
};

const items = [];

const handleCommand = (input) => {
  const [command, ...args] = input.trim().split(' ');

  switch (command) {
    case 'add':
      if (!args[0]) {
        console.log('Please provide a name');
        break;
      }
      items.push(args[0]);
      console.log(`Item "${args[0]}" added`);
      break;

    case 'list':
      if (items.length === 0) {
        console.log('No items');
      } else {
        items.forEach((item) => console.log(`- ${item}`));
      }
      break;

    case 'delete':
      if (!args[0]) {
        console.log('Please provide a name');
        break;
      }
      const index = items.indexOf(args[0]);
      if (index === -1) {
        console.log(`Item "${args[0]}" not found`);
      } else {
        items.splice(index, 1);
        console.log(`Item "${args[0]}" deleted`);
      }
      break;

    case 'exit':
      rl.close();
      process.exit(0);

    default:
      console.log(`Unknown command: "${command}"`);
      printHelp();
  }
};

console.log('Interactive CLI started. Type a command:');
printHelp();

rl.on('line', handleCommand);