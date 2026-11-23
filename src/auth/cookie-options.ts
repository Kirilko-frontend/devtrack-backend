import type { Response } from 'express';

import type { AuthTokens } from './auth.service';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
  };
};

export const setAuthCookies = (res: Response, tokens: AuthTokens) => {
  const now = Date.now();

  res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...getCookieOptions(),
    maxAge: tokens.accessTokenExpiresAt.getTime() - now,
  });

  res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...getCookieOptions(),
    maxAge: tokens.refreshTokenExpiresAt.getTime() - now,
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE, getCookieOptions());
  res.clearCookie(REFRESH_TOKEN_COOKIE, getCookieOptions());
};
