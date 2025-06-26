import { InvalidatedRefreshTokenError } from './invalidated-refresh-token-error';

describe('InvalidateRefreshTokenError', () => {
  it('should be defined', () => {
    expect(new InvalidatedRefreshTokenError()).toBeDefined();
  });
});
