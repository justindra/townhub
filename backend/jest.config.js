module.exports = {
  // setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  // roots: ["<rootDir>/test"],
  testMatch: ['**/*.*spec.(ts|tsx|js)'],
  transform: {
    '\\.ts$': 'esbuild-runner/jest',
  },
};
