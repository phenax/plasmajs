module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["eslint:recommended", "plugin:lodash/recommended", "prettier"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      experimentalDecorators: true,
      jsx: true
    },
    ecmaVersion: 2016,
    sourceType: "module"
  },
  plugins: ["prettier", "react", "lodash"]
};
