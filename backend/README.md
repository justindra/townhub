# Backend Structure

We've chosen to make two packages in the backend: `core` and `services`

- `core`: This should contain all the business logic for your application. Someone should be able to import this package and do everything that your application can do. It should not contain any specific interface information like REST API details or GraphQL schemas. It also should not depend on any other code in this repo.

  This roughly reflects Domain Driven Design. For a Todo application, core might look like this:

  ```
  /core
  /user
  /todo
  /notification
  index.ts
  ```

  Each folder contains all the implementation details for the domain. And exports only what is expected to be public to other domains. The index.ts should then export the domains that are public to the rest of the application.

* `services`: This package is for services that will be deployed to AWS. These can be Lambda functions that power your API, triggers for your event bus rules, etc. It should not contain any business logic on its own. It should import domains from core and only contain the minimal code necessary to call into them and forward results back.

  Here's an example of what this can look like.

  ```
  /services
      /auth
          cognito_triggers.ts
      /api
          user.ts
          todo.ts
      /notification
      bus_triggers.ts
  ```

# Testing

The `backend` folder contains minimal configuration to set up [Jest](https://jestjs.io/) which is a testing framework. The tests can be run using `yarn test` from inside the `backend` folder. Additionally, we are using `esbuild-runner` instead of `ts-jest` to compile the code making it significantly faster.

# Scripts

Full-stack serverless means a lot of your resources are up in the cloud. It can be helpful to have scripts to do things like insert data into the database or push items onto a queue.

We provide a scripts folder to create these scripts - they can import code directly from `@townhub/core`. This is an example of why it's helpful to separate your business logic from your lambda code. It allows it to be used in scripting scenarios without having to try and trigger lambdas housing the business logic.

We take advantage of `esbuild-runner` to execute the TypeScript code directly. You can use the included yarn script to run a script like this `yarn script ./scripts/example.ts`.
