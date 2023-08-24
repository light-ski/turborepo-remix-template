export default {
  // Run prettier on all files
  "**/*": "prettier --write --ignore-unknown",
  // Run typecheck when TS or prisma files change
  "**/*.{ts,tsx}": (files) => "npm run typecheck",
  // TODO: All DB imports from the Remix codebase should import from
  // "apps/utils/db.server", to ensure we don't put database code in our client bundles.
  // We might need to write a script for this since we might not be able to fit it
  // into a one-liner (for some reason, grep called through lint-staged has different
  // behavior than when its called on the command-line.)
};
