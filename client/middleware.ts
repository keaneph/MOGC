import type { NextRequest } from 'next/server'
import { updateSession } from './lib/middleware' // adjust path if needed

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
      Run middleware on all routes except:
      - /auth/*
      - /login
      - /_next (static assets)
      - /favicon.ico
    */
    '/((?!auth|login|_next|favicon.ico).*)',
  ],
}
