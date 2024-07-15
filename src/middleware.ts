import { RedirectToSignIn } from '@clerk/nextjs';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(["/subaccount"]);

export default clerkMiddleware((auth, req) => {

  if(isProtectedRoute(req)){
    auth().protect()
  }
 
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  let hostname= req.headers.get('host');

  const pathWithSearchParams = `${url.pathname}${searchParams.length>0 ? `?${searchParams}` : ''}`;
 
  //if the subdomain exists
  
  const customSubdomain = hostname?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];
  console.log("naem",customSubdomain);
  if(customSubdomain){
    return NextResponse.rewrite(new URL(`/agency/${customSubdomain}${pathWithSearchParams}`, req.url));  
  }
  if(url.pathname === '/sign-in' || url.pathname === '/sign-up'){
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }

  if(url.pathname === '/' || (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)){
    return NextResponse.rewrite(new URL('/site', req.url));
  }

  if(url.pathname.startsWith('/agency') && url.pathname.startsWith('/subaccount')){
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};