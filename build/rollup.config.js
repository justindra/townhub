import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
  // Set modules as external to suppress warnings from Rollup
  external: ['crypto'],
  plugins: [nodeResolve(), typescript()],
};
