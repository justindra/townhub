/**
 * Get the domain name for a website host based on the stage and any given
 * subdomain requirements.
 *
 * @param stage The stage, e.g. 'dev'
 * @param rootDomainName The rootDomain, this should correspond to a Route53 Hosted Zone
 * @param subdomains An optional list of subdomains to serve the urls on
 */
export const getDomainNameList = (
  stage: string,
  rootDomainName: string,
  subdomains?: string[]
): string[] => {
  const defaultDomain =
    stage === 'prod' ? `${rootDomainName}` : `${stage}.${rootDomainName}`;

  if (!subdomains || !subdomains.length) return [defaultDomain];

  return subdomains.map((subdomain) => `${subdomain}.${defaultDomain}`);
};
