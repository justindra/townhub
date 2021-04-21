import config from '../../build/rollup.config';

export default {
  ...config,
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
    {
      file: 'dist/index.js',
      format: 'commonjs',
    },
  ],
};
