import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
//import { terser } from 'rollup-plugin-terser'; // Optional minification
import fs from 'fs';
import path from 'path';

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// Extract exports from package.json
const exportsField = packageJson.exports || {};

const config = [];

// Loop through the exports and create a Rollup config for each entry
Object.entries(exportsField).forEach(([exportName, exportPaths]) => {
  // Ensure there are both "import" and "require" paths
  if (exportPaths.import && exportPaths.require) {
    const importPath = path.resolve(exportPaths.import.replace('./dist/esm/', './src/').replace('.js', '.js'));
    const requirePath = path.resolve(exportPaths.require.replace('./dist/cjs/', './src/').replace('.js', '.js'));

    // Add separate builds for CommonJS and ES Modules
    config.push({
      input: importPath,
      output: [
        {
          file: exportPaths.require, // CommonJS output
          format: 'cjs',
          exports: 'named',
        },
        {
          file: exportPaths.import, // ES Module output
          format: 'esm',
        }
      ],
      plugins: [
        resolve(),
        commonjs(),
        babel({ babelHelpers: 'bundled' }),
        //terser() // Optional for minifying the output
      ]
    });
  }
});

export default config;