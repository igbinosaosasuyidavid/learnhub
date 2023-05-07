import { NextResponse } from 'next/server'


// This function can be marked `async` if using `await` inside
export function middleware(req) {

  return NextResponse.next()
  //   return NextResponse.redirect(new URL('/auth/login', req.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}