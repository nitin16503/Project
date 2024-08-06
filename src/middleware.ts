import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/signup' || path === '/updatepassword' || path === '/signin' || path === '/admin/login'
  const userInfoString = request.cookies.get('user')?.value || null
  var token = ''; var userLevel = ''
  if (userInfoString) {
    var userInfo = JSON.parse(userInfoString)
    token = userInfo.token
    userLevel = userInfo.level
  }

  // custom redirection
  if(userLevel !== 'superAdmin'){

    if (path === '/' && token) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    }

    if (!isPublicPath && !token) {
      if(path.includes('admin')){
        return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
      }
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
  
    if (isPublicPath && token) {
      return NextResponse.redirect(new URL('/', request.nextUrl))
    }
  
    // redirection based on user level
    if(!isPublicPath && token){
      if (userLevel === 'radiologist') {
        if (path.startsWith('/dashboard/users')) {
          // Redirect to the access-denied page
          return NextResponse.redirect(new URL('/access-denied', request.nextUrl));
        }
      }
      if (userLevel === 'radiologistFrontDesk') {
        if (path.startsWith('/dashboard/users')) {
          // Redirect to the access-denied page
          return NextResponse.redirect(new URL('/access-denied', request.nextUrl));
        }
      }
    }
  }
  if(userLevel === 'superAdmin'){
    if (path === '/admin/login' && token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl))
    }

    if(!path.includes('admin')){
      return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl))
    }


    if ( !token) {
      return NextResponse.redirect(new URL('admin/login', request.nextUrl))
    }
  }

}

// Matching Paths
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/signin',
    '/dashboard/:path*',
    '/admin/:path*',
  ]
}