const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    settings: {
      // Use the existing resolver with the JavaScript project's import aliases.
      'import/resolver': { typescript: { project: './jsconfig.json' } },
    },
  },
  { ignores: ['dist/**'] },
]);
