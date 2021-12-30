/**
 * Get the domain name for a website host based on the stage and any given
 * subdomain requirements.
 *
 * @param stage The stage, e.g. 'dev'
 * @param rootDomainName The rootDomain, this should correspond to a Route53 Hosted Zone
 * @param subdomains An optional list of subdomains to serve the urls on
 */
export const getDomainNameList = (
  rootDomainName: string,
  subdomains?: string[]
): string[] => {
  if (!subdomains || !subdomains.length) return [rootDomainName];

  return subdomains.map((subdomain) => `${subdomain}.${rootDomainName}`);
};

/**
 * Get the domain name required for the SSL certificate, either the rootDomainName
 * or wildcard when it's hosted in the root.
 *
 * @param rootDomainName The rootDomain
 * @param subdomains An optional list of subdomains to serve the urls on
 * @param includeRootDomain Whether or not to host on rootDomain as well
 */
export const getSSLDomainName = (
  rootDomainName: string,
  subdomains?: string[],
  includeRootDomain = false
): { domainName: string; subjectAlternativeNames?: string[] } => {
  if (includeRootDomain) {
    return {
      domainName: rootDomainName,
      subjectAlternativeNames: (subdomains || []).map(
        (val) => `${val}.${rootDomainName}`
      ),
    };
  }

  return {
    domainName: `*.${rootDomainName}`,
  };
};
