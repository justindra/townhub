import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const baseConfig = {
  // Set modules as external to suppress warnings from Rollup
  external: (id) => {
    return ['crypyo', 'aws-sdk'].includes(id) || id.includes('@townhub');
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      clean: true,
      tsconfig: 'tsconfig.build.json',
    }),
    commonjs(),
    json(),
  ],
};

export const generateConfigForFile = (file) => {
  return {
    ...baseConfig,
    input: `src/${file}.ts`,
    output: [
      {
        file: `dist/${file}.es.js`,
        format: 'es',
      },
      {
        file: `dist/${file}.js`,
        format: 'commonjs',
      },
    ],
  };
};

export const generateConfigFromPackageJson = (pkgJson) => {
  if (!pkgJson.exports) {
    const main = pkgJson.main || 'dist/index';
    const fileName = main.split('/').pop();
    return generateConfigForFile(fileName);
  }

  const inputFiles = Object.values(pkgJson.exports).map((val) => {
    return val.split('/').pop();
  });

  return inputFiles.map((file) => generateConfigForFile(file));
};

export default baseConfig;
