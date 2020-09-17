# AWS CDK Setup

We will be trialling the use of [AWS CDK](https://aws.amazon.com/cdk/) to define some of our static infrastructure. To make this easier on us, we will also be using the [Serverless Stack Toolkit](https://github.com/serverless-stack/serverless-stack). This should make it easier for us to get some consistencies in our environments.

Here is what we will do to get it all setup.

```bash
$ cd infrastructure
$ yarn init serverless-stack resources cdk --language typescript --use-yarn
```

This will then create a new CDK project in the `cdk` folder. Now we need to change a few things to make sure it works with our monorepo.

Firstly, we need to make sure that our types come from the root as well as the package's own `node_modules` folder.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "../../node_modules/@types"]
  }
}
```

Then, move the `MyStack.test.ts` into the `lib` folder. This is a preference, but I find that keeping your tests next to the file you are testing makes it much easier to find once your project grows larger.

And lastly, update the name of your package in `package.json` and `sst.json` to match each other. Again, this is a preference thing, but working in a monorepo, I prefer to keep everything under a scope that describes the project and the folder structure it is in.

```jsonc
// package.json
{
      "name": "@townhub/infra-cdk"
}
// sst.json
{
  "name": "townhub-infra-cdk"
}
```

To test everything, you should be able to run the following commands from the package folder.

```
$ yarn test
$ yarn build
$ yarn deploy
$ yarn remove
```
