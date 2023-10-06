# Turborepo, Remix, Drizzle ORM, Bolt (Slack) Monorepo Template

This is a template of a monorepo that runs a Remix app and a Slack (Bolt JS) app, sharing internal packages (including Drizzle ORM), all managed by Turborepo, all in Typescript. I ran into some issues setting this up for Lightski, so I'm open-sourcing this template for others that want to run a similar setup. This template provides the following:

1. A Remix app managed by Turborepo, importing internal packages, using Typescript and Tailwind, with watch paths and packages properly transpiled
1. A Slack ([Bolt JS](https://slack.dev/bolt-js/tutorial/getting-started)) app managed by Turborepo, importing internal packages
1. Internal packages in a ES Module and Typescript format instead of CJS, ensuring that stack traces surfaced in these internal packages as they're used in the apps appear with proper line numbers tying them back to the Typescript files (not the compiled Javascript ones). This is not a feature that exists in the official Turborepo examples that provides a significant ergonomic improvement
1. A Drizzle ORM internal package that's properly compiled and loaded in the Remix app.
1. Shared ESLint and TSConfig files across all packages
1. Deployment instructions for both the Remix and Bolt JS apps on [Fly](fly.io), since the default instructions didn't work out-of-the-box
1. Prettier setup across the entire repo
1. Typescript/formatting checks using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky) on every commit
1. Pre-set `DIRECT_URL` in addition to `DATABASE_URL` for DB connection pooling (implemented how Supabase recommends you implement it, though you might not need it for Drizzle ORM)

This template is built for Lightski, so if you want to use it for your own team, make sure to replace `lightski` everywhere in this codebase with your own app name.

Turborepo also offers other helpful [examples](https://turbo.build/repo/docs/getting-started/from-example).

## Installation

1. Install stuff and set environment variables

```sh
cp apps/remix/.env.dev apps/remix/.env
cp apps/bolt/.env.dev apps/bolt/.env
# Needs to be installed globally, since installing turbo locally also
# tries to include it in our Dockerfile, which causes an error.
npm install --global turbo
npm install

```

1. Set up a local database by installing [Postgres.app](https://postgresapp.com/). The default database connection URL is `postgresql://postgres:example@localhost:5432/DB_NAME`
1. Set `DATABASE_URL` and `DIRECT_URL` in both `.env` files to the connection URL. Note that you'll need to do this in all of the .env files you copied above. If you're not using [connection pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler) with your database provider, you can ignore `DIRECT_URL`. `DATABASE_URL` should be your pooled URL; `DIRECT_URL` is a direct URL.
1. Migrate your database to the current state by doing:

```sh
npx turbo db:migrate:dev db:generate
```

1. If you're doing development on the Slack App, navigate to `apps/bolt/README.md` and complete the steps there.

## Development

```sh
# Run all apps at once. This will automatically handle port collisions.
npm run dev

# Run individual apps
npm run dev --workspace={@lightski/remix, @lightski/bolt, ...}
```

If you want to add a new internal package, follow the [Turborepo steps](https://turbo.build/repo/docs/handbook/sharing-code/internal-packages) to do so. Make sure to add the package name to `apps/remix/remix.config.js` as well to properly transpile them.

### Routine tips

Turborepo enforces certain ways to install packages, even for routine tasks. When installing a package, make sure to go to the root `lightski` directory, and run:

```sh
npm install PACKAGE_NAME --workspace={@lightski/remix, @lightski/bolt, @lightski/database, ...}
```

If you run into any issues around package versions, use [manypkg](https://www.npmjs.com/package/@manypkg/cli) to fix them:

```sh
npx manypkg check
npx manypkg fix
```

If you want to clean your local packages and reinstall everything, run the following:

```sh
npm run clean
npm install
```

### Database Migrations

We use Drizzle ORM to communicate with the database and `drizzle-kit` to [do migrations](https://orm.drizzle.team/kit-docs/commands).

#### In Development

When we're developing a new schema change, we don't want to create a migration just yet--we want to make schema changes directly on the database. To do so we use Drizzle ORM's `push` feature.

1. Update `packages/database/src/schema.ts` to the latest schema.
1. Run `npm run db:push`. You should see the changes applied to your local database, but no migration file should have been created. Run this command as often as you need--Drizzle will figure out how to update your local database to the schema in `schema.ts`.

#### Generating a Migration

Once we've decided on a particular schema change and want to commit the change, we need to create a migration for that change.

1. Update `packages/database/src/schema.ts` to the latest schema.
1. Run `npx ts-node packages/database/bin/migrate.ts` to commit the migration to your local database. This might not do anything if your database was already at the latest schema.
1. Run `npx ts-node packages/database/bin/migrate.ts` to commit the migration to your local database.

If you accidentally created a migration and want to remove it, run `npm run db:drop` in the root monorepo. Drizzle will ask you which migration to remove.

#### Generating a Custom Migration

For certain migrations (indexes, triggers, etc.) that aren't supported by Drizzle's `generate` feature, we may need to create it ourselves.

1. In the root monorepo, run `npm run db:generate --custom`. This generates a custom migration in `packages/database/drizzle` that you can manually modify.

#### Other Help

- `npm run db:check` runs a consistency check
- `npm run db:up` updates Drizzle's metadata to the latest version. Run this whenever Drizzle is upgraded.

### Editor Setup

If you're using VSCode, add the following to your `settings.json` to enable format on save:

```json
{
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,

  "prettier.trailingComma": "all",
  "prettier.requireConfig": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Deployment

This template includes instructions on how to deploy the apps to [Fly](fly.io).

### Initial Setup

Follow the instructions to get set up with Fly.io [here](https://fly.io/docs/hands-on/install-fly/).
Here's the things we had to do to get it running on the very first deploy.

1. Set up a custom Dockerfile to support both Turborepo and Remix
1. Ensure that the `apps/remix/fly.toml` file routed the right external ports (80, 443) to the right internal ones (8080)
1. Ensure the exposed Remix host and port were 0.0.0.0 and 8080, respectively
1. Ensure that you replace the app name in both `fly.toml` files
1. Set up production secrets
1. Set up a Fly.io IPv4 Address (if there isn't one already) `fly ips allocate-v4 --shared --app APP_NAME`
1. Set up a Fly.io IPv6 Address (for Flycast) `fly ips allocate-v6 --private --app APP_NAME`
1. Set up a nginx server to route between the two servers. Note that this nginx app is not included in the template--feel free to reach out if you need pointers
1. Set up your DNS records to properly point to Fly's websites

### Incremental Deployments

Run deployment from the root directory with the following commands. They need to be run from the root directory because Turborepo works on the root. Make sure you have `flyctl` installed and are logged in.

```bash
# Deploy API server
fly deploy --config ./apps/bolt/fly.toml --dockerfile Dockerfile.apps.api

# Deploy Remix app
fly deploy --config ./apps/remix/fly.toml --dockerfile Dockerfile.apps.remix
```

### Tips and tricks

```sh
# Append --local-only to do the docker build on your local computer
fly deploy --config ./apps/bolt/fly.toml --dockerfile Dockerfile.apps.api --local-only

# Destroy our remote builder machine if it's not responding
fly apps destroy APP_NAME

# Get to a console in prod
fly ssh console --app APP_NAME --select
# Then, run the following:
cd app
npx ts-node

# Get status
fly status --config ./apps/APP/fly.toml

# Tail logs
fly logs --config ./apps/APP/fly.toml

# Restart app
fly apps restart FLY_APP_NAME

# Destroy builder (do this if there's no more space left on the machine)
fly apps destroy FLY_BUILDER_NAME
```

### Production Migrations

Handle all production migrations using Drizzle ORM.

We do Production Migrations manually for now. Once we set up Github Actions/CI/CD pipeline, we'll automate them. Right now, there's not an easy way to do so from the docker container while it's building.

```sh
# Either app should be ok, since both have a connection to the database.
fly ssh console --app APP_NAME --select

cd packages/database
# TBD
```

## Good References

- [Information on PG Bouncer](https://jpcamara.com/2023/04/12/pgbouncer-is-useful.html)
