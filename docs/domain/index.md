# Domain

One of the things we need to do to setup our deployment is to setup our domains and Route53 so we can use that domain name for our applications.

## Domain Name

For the domain name, you can buy domain names from any provider, but to make it easier, I'm just going to buy it from AWS. Follow the steps [here](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html) for how to get a domain name through Route53.

## Hosted Zone

Hosted Zone is basically your DNS Records. If you bought the domain name through the AWS Console, it should automatically create a HostedZone. Otherwise, go create a new one linked to the domain name.
