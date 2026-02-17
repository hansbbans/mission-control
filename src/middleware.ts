// Middleware disabled - public dashboard
// To re-enable authentication, uncomment the code below

/*
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const password = request.cookies.get('mission-control-pw')?.value
  const correctPassword = process.env.MISSION_CONTROL_PASSWORD || 'admin'
  
  // Allow API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/login'
  ) {
    return NextResponse.next()
  }
  
  // Check password
  if (password !== correctPassword) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!login).*)',
}
*/
