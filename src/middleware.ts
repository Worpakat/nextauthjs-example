import { NextRequestWithAuth, withAuth, WithAuthArgs } from 'next-auth/middleware';
import { pages } from 'next/dist/build/templates/app-page';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export default withAuth(
    
    function middleware(request: NextRequestWithAuth) {   
        //Admin page authorization.     
        if (request.nextUrl.pathname.startsWith("/admin") && request.nextauth.token?.role !== "admin") {
            return NextResponse.rewrite(new URL('/', request.url));
        }
    },
    {
        pages: {
            signIn: '/signin',
            // error: '/auth/error', // Error code passed in query string as ?error=
        }
    }
)

export const config = {
    matcher: ['/profile/:path*', '/admin/:path*'],
}     