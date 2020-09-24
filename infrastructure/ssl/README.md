# Townhub Infrastructure SSL

This package is made mainly so that we can generate an SSL Certificate required for CloudFront in the `us-east-1` region. And then export that value in a Stack that exists in whatever other region we want it to be in.

The details of this logic is in [scripts/deploy.js](./scripts/deploy.js).

> This is pretty ugly, but not sure what else to do at this point-in-time. But definitely should fix it at some point if we can find a better solution.
> Possible solutions:
>
> - Create custom resources to deal with these from a Lambda function
> - Terraform (not tested, heard good things from @ndench)
> - CDK for Terraform (still in Alpha, so quite unstable to use atm)
> - Pulumi (not tested)
