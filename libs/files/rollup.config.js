import config from '../../build/rollup.config';

export default {
  ...config,
  external: (id) => {
    return config.external(id) || ['sharp'].includes(id);
  },
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
