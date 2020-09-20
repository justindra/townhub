import { getDomainName } from './helpers';

describe('getDomainName Helper', () => {
  const rootDomainName = 'example.com';
  it('should return the rootdomain on prod without subdomain', () => {
    const res = getDomainName('prod', rootDomainName);

    expect(res).toEqual(rootDomainName);
  });

  it('should return the rootdomain on dev without subdomain', () => {
    const res = getDomainName('dev', rootDomainName);

    expect(res).toEqual(`dev.${rootDomainName}`);
  });

  it('should return the subdomain on prod', () => {
    const res = getDomainName('prod', rootDomainName, 'test');

    expect(res).toEqual(`test.${rootDomainName}`);
  });
  it('should return the subdomain on dev', () => {
    const res = getDomainName('dev', rootDomainName, 'test');

    expect(res).toEqual(`test.dev.${rootDomainName}`);
  });
});
