import { isConfiguredApiRequest } from './api';

describe('API URL boundary', () => {
  for (const base of ['http://localhost:3000', 'https://odogwubites.onrender.com']) {
    it(`recognizes the exact configured origin ${base}`, () => {
      expect(isConfiguredApiRequest(`${base}/auth/profile`, base)).toBeTrue();
      expect(isConfiguredApiRequest(`${base}/payment`, base)).toBeTrue();
    });

    for (const url of [
      `${base}.evil.test/auth`,
      `https://evil.test/?next=${base}/auth`,
      `https://evil.test/${base}/auth`,
      `${base.replace('://', '://evil.test@')}/auth`,
      `${base.replace('://', '://user:password@')}/auth`,
      `${base.replace('http:', 'https:').replace('https://odogwu', 'http://odogwu')}/auth`,
      '/auth/profile',
      'invalid URL',
    ]) {
      it(`rejects an unintended or malformed URL ${url}`, () => {
        expect(isConfiguredApiRequest(url, base)).toBeFalse();
      });
    }
  }

  it('checks path boundaries when the API is hosted below a path prefix', () => {
    const base = 'https://example.test/api/v1/';
    expect(isConfiguredApiRequest('https://example.test/api/v1', base)).toBeTrue();
    expect(isConfiguredApiRequest('https://example.test/api/v1/auth', base)).toBeTrue();
    expect(isConfiguredApiRequest('https://example.test/api/v10/auth', base)).toBeFalse();
    expect(isConfiguredApiRequest('https://example.test/api/v1/../admin', base)).toBeFalse();
    expect(isConfiguredApiRequest('https://example.test/other', base)).toBeFalse();
    expect(isConfiguredApiRequest('https://example.test:444/api/v1/auth', base)).toBeFalse();
  });
});
