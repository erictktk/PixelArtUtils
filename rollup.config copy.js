import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import path from 'path';
import glob from 'glob';

// Get all JavaScript files in the src directory
const inputFiles = glob.sync('src/**/*.js').reduce((acc, file) => {
  // Create an object where each file path is mapped to its entry point
  const entryName = path.basename(file, path.extname(file));
  acc[entryName] = file;
  return acc;
}, {});

const createConfig = (format, suffix) => ({
  input: 'src/index.js', // Use 'index.js' as the main entry point
  output: [
    {
      dir: path.resolve('dist', suffix),
      format,
      sourcemap: true,
      entryFileNames: '[name].js', // Use the filename as the entry point
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' })
  ],
  external: ['path'] // List any external dependencies that should not be bundled
});

export default defineConfig([
  createConfig('cjs', 'cjs'),
  createConfig('esm', 'esm')
]);