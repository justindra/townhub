import { getDomainNameList } from './helpers';

describe('getDomainNameList Helper', () => {
  const rootDomainName = 'example.com';
  it('should return the rootdomain on prod without subdomain', () => {
    const res = getDomainNameList(rootDomainName);

    expect(res).toEqual([rootDomainName]);
  });

  it('should return the rootdomain on dev without subdomain', () => {
    const res = getDomainNameList(rootDomainName);

    expect(res).toEqual([`dev.${rootDomainName}`]);
  });

  it('should return the subdomain on prod', () => {
    const res = getDomainNameList(rootDomainName, ['test']);

    expect(res).toEqual([`test.${rootDomainName}`]);
  });
  it('should return the subdomain on dev', () => {
    const res = getDomainNameList(rootDomainName, ['test']);

    expect(res).toEqual([`test.dev.${rootDomainName}`]);
  });

  it('should return the list of subdomains on prod', () => {
    const res = getDomainNameList(rootDomainName, ['test', 'dev', 'stage']);

    expect(res).toEqual([
      `test.${rootDomainName}`,
      `dev.${rootDomainName}`,
      `stage.${rootDomainName}`,
    ]);
  });
  it('should return the list of subdomains on dev', () => {
    const res = getDomainNameList(rootDomainName, ['test', 'dev', 'stage']);

    expect(res).toEqual([
      `test.dev.${rootDomainName}`,
      `dev.dev.${rootDomainName}`,
      `stage.dev.${rootDomainName}`,
    ]);
  });
});
