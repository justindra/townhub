# Townhub Infrastructure SSL

This package is made mainly so that we can generate an SSL Certificate required for CloudFront in the `us-east-1` region. And then export that value in a Stack that exists in whatever other region we want it to be in.

The details of this logic is in [scripts/deploy.js](./scripts/deploy.js).

> This is pretty ugly, but not sure what else to do at this point-in-time. But definitely should fix it at some point if we can find a better solution.

TODO:

- Create a custom resource to allow S3 Bucket to be deleted as currently you have to do that through the console
- Create a custom resource to find the SSL Certificate in `us-east-1` rather than this weird, hacky thing we do currently
  - Perhaps even allow the custom resource to also create the SSL Certificate itself if it doesn't exist, or create a new one and remove the old one, to add an extra domain name in there.
  - We can tag the certificate with some special tag to specify that its the one we are managing now
