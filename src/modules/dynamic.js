// const dynamic = async () => {
//   // Write your code here
//   // Accept plugin name as CLI argument
//   // Dynamically import plugin from plugins/ directory
//   // Call run() function and print result
//   // Handle missing plugin case
// };

// await dynamic();
import path from 'path';
import { pathToFileURL } from 'url';

const dynamic = async () => {
  const [, , pluginName] = process.argv;

  if (!pluginName) {
    console.error('Plugin name is required');
    return;
  }

  try {
    const pluginPath = path.resolve(
      process.cwd(),
      'src',
      'modules',
      'plugins',
      `${pluginName}.js`,
    );

    const pluginUrl = pathToFileURL(pluginPath).href;

    const module = await import(pluginUrl);

    if (typeof module.run !== 'function') {
      console.error('Plugin has no run() function');
      return;
    }

    const result = await module.run();
    console.log(result);
  } catch (err) {
    console.error('Plugin not found');
  }
};

await dynamic();