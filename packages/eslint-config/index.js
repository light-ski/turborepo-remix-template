module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "standard-with-typescript",
    "turbo",
    "prettier",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  plugins: ["react", "@typescript-eslint"],
};
