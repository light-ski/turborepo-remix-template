/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  dev: {
    port: 3000,
  },
  serverDependenciesToBundle: [
    "@lightski/constants",
    "@lightski/database",
    "@lightski/helpers",
  ],
  watchPaths: async () => {
    // Ensure we rebuild when we update a dependent package in the monorepo.
    return [
      "./../../packages/constants",
      "./../../packages/database",
      "./../../packages/helpers",
    ];
  },
  serverModuleFormat: "cjs",
};
