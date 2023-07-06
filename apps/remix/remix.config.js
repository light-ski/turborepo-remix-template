/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  future: {
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  tailwind: true,
  serverDependenciesToBundle: [
    "@lightski/constants",
    "@lightski/database",
    "@lightski/helpers",
  ],
  tailwind: true,
  watchPaths: async () => {
    // Ensure we rebuild when we update a dependent package in the monorepo.
    return [
      "./../../node_modules/.prisma/client",
      "./../../packages/constants",
      "./../../packages/helpers",
    ];
  },
};
