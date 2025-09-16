module.exports = {
  root: false,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest"
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {}
};
