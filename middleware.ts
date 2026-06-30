import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/storybook' || pathname === '/storybook/') {
    return NextResponse.redirect(
      new URL('/storybook/index.html', request.url),
    );
  }
}

export const config = {
  matcher: ['/storybook', '/storybook/'],
};
