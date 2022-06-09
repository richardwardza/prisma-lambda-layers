# Introduction

This is a quick project to show how AWS SAM can deploy a Prisma based typescript project using layers.

The project has four components, two lambdas ( `createUser` and `listUsers` ) and two layers ( `libs` and `prisma` ).

Each of the components are thier own "project" with their own `package.json`, `esbuild` script, etc.

The `template.yaml` file is the default file for a SAM AWS project and defines the layers and lambdas.

Each of the components requires a transpile step to take the code from typescript to javascript and bundle it for deployment to AWS Lambda. This is done by means of the `esbuild.js` file.

In the two `handlers` the `tsconfig.json` has the `paths` property set as follows:

```
"paths": {
      "/opt/nodejs/libLayer": [
        "../../layers/libs/src/libLayer",
      ],
      "/opt/nodejs/prismaLayer": [
        "../../layers/prisma/src/prismaLayer",
      ],
      "/opt/nodejs/node_modules/*": [
        "../../layers/prisma/node_modules/*",
      ],
      "@shared/*": [
        "../../shared/*",
      ]
    }
```

This allows us to access typed code from the `libs` and `prisma` layers in the handler. The mapping of `/opt/nodejs/*` is specifically chosen as that is where Lambda extracts the `layers` to when deploying.

The `esbuild.js` file is set to exclude bundling files from the `/opt/nodejs/*` directory s that we do not end up bundling the layer in the handler and thereby increasing the size of the lambda and making the layer redundant.

The `@shared/*` path allows us to share code between the various modules. This is very useful for sharing `types` between the handler and the `layers`.

e.g. in the handler you have a function that generates a `Post` type and in the `prisma` layer you have a function that accepts the `Post` type. Having it in both places means that they both need to be updated and can get out of sync. Having it in a shared locatin means there is one surce of truth only.

Becasue we have not added it to the `excludes` in `esbuild.js`, the `@shared` folder will be bundled in the the generated file for both the `handler` and the `layer`. `esbuild` also does `tree shaking` so only the required items will be included in the bundle.

# Prisma

The settings below are for your information and are in the `package.json` script in the `prismaLayer` and already set in the `template.yaml` file:

To get Prisma running correctly in the Lambda environment you need to include `"rhel-openssl-1.0.x"` in the `binaryTargets` of your `schema.prisma`.

The `schema.prisma` file needs to be in the "root" level directory of the `prismaLayer` (this is included in the `pnpm run prod:build` command).

The environment variable `PRISMA_QUERY_ENGINE_LIBRARY` needs to speficy the location of the binary to use. This should be `/opt/nodejs/node_modules/.prisma/client/libquery_engine-rhel-openssl-1.0.x.so.node`.

Finally, the `DATABASE_URL` needs to be set as per normal. (see the `src/layers/prisma/env.sample` file for an example)

(The `template.yaml` file can be updated to read the values from the ENV variables)

# Database

A `docker-compose.yml` file is included that will start up postgres in docker for development purposes. The credentials should match the `src/layers/prisma/env.sample` file.

# Requirements

The project use [pnpm](https://pnpm.io/) so please ensure that is installed (`npm install -g pnpm`).

Once you have `pnpm` installed you can run the following:

Start a local database (if you do not have one):

```
docker-compose up
```

Setup the development Prisma database connection by renaming `src/layers/prisma/env.sample` to `src/layers/prisma/.env` and edit it if necessary. The sample connection will work with the `docker-compose.yml` file above.

```
mv src/layers/prisma/env.sample src/layers/prisma/.env
```

Install the dependencies in the various layers and handlers using:

```
pnpm run install-all
```

Build the various layers and handlers using:

```
pnpm run build
```

If you have your `aws credentals` setup already then you can use `pnpm deploy` to deploy the stack to AWS.

# Local Development

For local development you can go to the directory of the lambda you wish to develop and run `yarn dev` which uses `nodemon` to run the `src/devServer.ts` file. This starts a local express server which uses [local-lambda](https://github.com/ashiina/lambda-local) to call the `handler.ts` file as it would be called in AWS.

When you update your source, nodemon will detect the change and restart the service.

## Layer updates

If you need to make a change to one of the `layers` or `shared` files, then after saving the `layer` file, save a file in the current lambda to force `nodemon` to restart the service. The cahnge that was made in the `layer` will now reflect.