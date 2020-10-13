import config from '../../build/rollup.config';

export default {
  ...config,
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
    },
    {
      file: 'dist/index.common.js',
      format: 'commonjs',
    },
  ],
};
