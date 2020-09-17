# Townhub

Townhub is a project that I started to firstly figure out what is the nicest way to develop an application in a monorepo that allows me to scale up as well as to try new type of technologies. The main principle here is that I should automate as many things as possible. The more repeatability there is, the better.

## Tech Stack

This is the list of technologies that I may use. Or might not, just an idea at the moment.

| Name                                                        | Purpose                                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [Serverless Framework](https://www.serverless.com/)         | Easier to deploy Lambda functions                                                                          |
| [AWS CDK](https://aws.amazon.com/cdk/)                      | To deploy other infrastructures that are not related to Lambda, hopefully nicer to use than CloudFormation |
| [SST](https://github.com/serverless-stack/serverless-stack) | To combine Serverless Framework and AWS CDK nicer                                                          |
| [Lerna](https://github.com/lerna/lerna)                     | To manage monorepo                                                                                         |
| [Yarn](https://yarnpkg.com/)                                | As a package manager (and workspaces for monorepo)                                                         |
| [TypeScript](https://www.typescriptlang.org/)               | Main programming language                                                                                  |
| [Prettier](https://prettier.io/)                            | Keep our code pretty                                                                                       |
| [Vue](https://vuejs.org/)                                   | For frontend code                                                                                          |
