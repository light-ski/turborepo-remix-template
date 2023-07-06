module.exports = {
  printWidth: 90,
  trailingComma: "all",
  importOrder: ["^([./]|app/|~/)"],
  importOrderSeparation: true,
  // tailwindConfig: "./apps/web/tailwind.config.ts",
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
  // For some reason, it still doesn't work in VS Code but works on the command-line.
  pluginSearchDirs: false,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss", // Must come last
  ],
};
