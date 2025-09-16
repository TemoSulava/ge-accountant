module.exports = {
  root: true,
  extends: ["../../packages/config/eslint/base.cjs", "plugin:react-hooks/recommended"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  ignorePatterns: ["dist", "node_modules"],
  rules: {}
};
