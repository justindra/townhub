# Townhub

Townhub is a web-app that allows any newcomers, locals or visitors to a town to find resources for that town.

Modules/features:

- Shuttles: A way for users to see the timetable of the town shuttle in a more visual way overlaid on top of a map.
- *Upcoming* Communities: a way for users to see a list of all local communities to join
- *Upcoming* Vendors: a way for users to see a list of all local artisans and their products

Current towns:

- [Fernie](https://fernie.townhub.ca)
- [Revelstoke](https://revelstoke.townhub.ca)
- If you think your town needs this, contact me or add a github issue to add your town in.

## Open-source Education

Outside of helping its users to find and locate things, Townhub is an open-sourced project to allow other people to see how a TypeScript Serverless app can be architected. I am taking some of my learnings from my full-time work building enterprise and consumer apps into Townhub. If you have any questions on how I do certain things here and my reasonings behind it, feel free to message me or create a Github issue. I can maybe do a blog-post explaining more in detail.

## Tech Stack

| Name                                                        | Purpose                                                                                                                       |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [Serverless Framework](https://www.serverless.com/)         | Easier to deploy Lambda functions                                                                                             |
| [AWS CDK](https://aws.amazon.com/cdk/)                      | To deploy other infrastructures that are not related to Lambda, eventually might change to use Terraform or the Terraform CDK |
| [SST](https://github.com/serverless-stack/serverless-stack) | To combine Serverless Framework and AWS CDK nicer                                                                             |
| [Lerna](https://github.com/lerna/lerna)                     | To manage monorepo                                                                                                            |
| [Yarn](https://yarnpkg.com/)                                | As a package manager (and workspaces for monorepo)                                                                            |
| [TypeScript](https://www.typescriptlang.org/)               | Main programming language                                                                                                     |
| [Prettier](https://prettier.io/)                            | Keep our code pretty                                                                                                          |
| [React](https://reactjs.org/)                               | For frontend code                                                                                                             |
