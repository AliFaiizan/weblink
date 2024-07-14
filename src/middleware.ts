import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/agency/sign-in(.*)', '/agency/sign-up(.*)', "/site", "/api/uploadthing"]);

export default clerkMiddleware((auth, request) => {
  if(!isPublicRoute(request)) {
    auth().protect(); // Protect all routes except the public ones  
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};