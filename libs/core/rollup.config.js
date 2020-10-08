import config from '../../build/rollup.config';

export default {
  ...config,
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
};
