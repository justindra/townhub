import * as cdkContextJson from '../../cdk.context.json';

/**
 * Get the domain name for a website host based on the stage and any subdomain
 * requirements.
 *
 * @param stage The stage, e.g. 'dev'
 * @param rootDomainName The rootDomain, this should correspond to a Route53 Hosted Zone
 * @param subdomain An optional subdomain to provide
 */
export const getDomainName = (
  stage: string,
  rootDomainName: string,
  subdomain?: string
): string => {
  const defaultDomain =
    stage === 'prod' ? `${rootDomainName}` : `${stage}.${rootDomainName}`;

  if (!subdomain) return defaultDomain;

  return `${subdomain}.${defaultDomain}`;
};

export const getCertificateArnFromContext = () => {
  const keys = Object.keys(cdkContextJson);
  const arnKey = keys.find((val) => val.includes('ssm:account')) ?? '';
  return (cdkContextJson as any)[arnKey];
};
