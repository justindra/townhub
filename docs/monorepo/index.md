# Monorepo

We need to setup the monorepo so that we can continuously build things whilst keeping code as DRY as possible. We are going to use a combination of Lerna and Yarn Workspaces to achieve this.

## Folder Structure

This repository is a monorepo that contains all code for all of the infrastructure, backend and frontend. The idea is that we should be able to easily deploy this project into a new AWS organisation if we need to. Here is a bit of a rough structure of what I think would be in each directory.

```bash
.
├── docs            # Any additional documentations and write-ups
├── infrastructure  # Static Infrastructure - this ideally should not be changing often once its setup
|   ├── databases
|   ├── ci-cd
|   └── apps
├── backend         # Backend code - should mainly be lambda functions and services
|   ├── service-a
|   └── service-b
├── frontend        # Frontend code - should be the different frontend apps
|   ├── homepage
|   ├── app-a
|   └── app-b
└── libs            # Shared libraries between different applications/services
    ├── models
    ├── components
    └── api
```

## Setup tools

So now that we have an idea of what our directory structure should be, we need to setup some tools to help us with the monorepo. Let's setup [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna).

```bash
$ cd root-of-project
$ npx lerna init
```

Now update `lerna.json` that was created in the root to be the following:

```json
{
  "version": "0.0.0",
  "npmClient": "yarn", // Set Yarn as default package manager
  "useWorkspaces": true, // Use Yarn Workspaces
  "packages": ["backend/*", "frontend/*", "libs/*", "infrastructure/*"] // Set all the packages in the monorepo based on our folder structure
}
```

And update `package.json` to be the following:

```json
{
  "private": true,
  "workspaces": ["backend/*", "frontend/*", "libs/*", "infrastructure/*"],
  "devDependencies": {
    "lerna": "^3.22.1"
  }
}
```

## Setup Prettier

We are now setup to have a monorepo using those two tools. While we here, let's also setup some automation to keep some consistencies in our code. One of these things is [Prettier](https://prettier.io/). We want prettier to run every-time we commit new code. So this is why we are adding [Husky](https://github.com/typicode/husky) and [Lint-Staged](https://github.com/okonet/lint-staged) to help with that. While still in the root of our project folder, run the following:

```bash
$ yarn add --dev -W husky prettier lint-staged
```

Then add the following to `package.json`

```json
{
  ...,
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*": "prettier --write --ignore-unknown"
  }
}
```

Add `prettier.config.js` file in the root to save our Prettier configuration.

```js
// prettier.config.js
module.exports = {
  singleQuote: true,
  arrowParens: 'always',
  jsxSingleQuote: true,
  jsxBracketSameLine: true,
  tabWidth: 2,
};
```

Now when you commit all this new code, Prettier should run over all the text and keep your code formatted nicely.
