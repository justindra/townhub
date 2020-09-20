# Townhub Infrastructure SSL

This package is made mainly so that we can generate an SSL Certificate required for CloudFront in the `us-east-1` region. And then export that value in a Stack that exists in whatever other region we want it to be in.

The details of this logic is in [scripts/deploy.js](./scripts/deploy.js)
