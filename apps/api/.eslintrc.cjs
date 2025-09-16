module.exports = {
  root: true,
  extends: ["../../packages/config/eslint/base.cjs"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ["dist", "node_modules"],
  rules: {}
};
