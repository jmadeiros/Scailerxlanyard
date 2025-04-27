// Debug logging
const debug = (...args) => console.log('[PostCSS Debug]', ...args);

debug('Loading PostCSS config...');
debug('Node process cwd:', process.cwd());
debug('Attempting to require modules...');

try {
  debug('Loading autoprefixer...');
  const autoprefixer = require('autoprefixer');
  debug('Autoprefixer loaded:', !!autoprefixer);
  
  debug('Loading tailwindcss...');
  const tailwindcss = require('tailwindcss');
  debug('Tailwind loaded:', !!tailwindcss);

  debug('Creating PostCSS config...');
  const config = {
    plugins: {
      'tailwindcss': {},
      'autoprefixer': {},
    }
  };
  debug('PostCSS config created:', JSON.stringify(config, null, 2));
  
  module.exports = config;
  debug('PostCSS config exported successfully');
} catch (error) {
  debug('Error loading modules:', error.message);
  debug('Module resolution paths:', module.paths);
  throw error;
} 