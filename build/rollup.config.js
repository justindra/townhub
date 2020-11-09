import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  // Set modules as external to suppress warnings from Rollup
  external: ['crypto', 'aws-sdk'],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      declaration: true,
      clean: true,
      tsconfig: './tsconfig.build.json'
    }),
    commonjs(),
    json(),
  ],
};
