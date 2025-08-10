// import { withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { useSession } from 'next-auth/react';

// export default withAuth(
//   async function middleware(request: NextRequest) {
//     // const session = request.nextauth.token;
//     const { data: session, status } = useSession();
//     const pathname = request.nextUrl.pathname;
//     console.log("middleware")
//     // Redirect unauthenticated users to sign-in
//     if (!session) {
//       console.log(`Middleware: No session, redirecting to /signin from ${pathname}`);
//       return NextResponse.redirect(new URL('/signin', request.url));
//     }

//     // Ensure role is valid, default to 'applicant' if undefined
//     const role = session.user?.role || 'applicant';

//     // Define role-specific redirect URLs
//     const roleRedirects: { [key: string]: string } = {
//       admin: '/admin',
//       manager: '/manager',
//       reviewer: '/reviewer',
//       applicant: '/applicant',
//     };

//     // Get the user's role-specific redirect URL
//     const redirectUrl = roleRedirects[role] || '/applicant';

//     // Log for debugging (remove in production)
//     console.log(`Middleware: pathname=${pathname}, role=${role}, redirectUrl=${redirectUrl}`);

//     // Protect role-specific routes
//     if (pathname.startsWith('/admin') && role !== 'admin') {
//       console.log(`Middleware: Unauthorized admin access by ${role}, redirecting to ${redirectUrl}`);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
//     if (pathname.startsWith('/manager') && role !== 'manager') {
//       console.log(`Middleware: Unauthorized manager access by ${role}, redirecting to ${redirectUrl}`);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
//     if (pathname.startsWith('/reviewer') && role !== 'reviewer') {
//       console.log(`Middleware: Unauthorized reviewer access by ${role}, redirecting to ${redirectUrl}`);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
//     if (pathname.startsWith('/applicant') && role !== 'applicant') {
//       console.log(`Middleware: Unauthorized applicant access by ${role}, redirecting to ${redirectUrl}`);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }

//     return NextResponse.next();
//   },
//   {
//     pages: {
//       signIn: '/signin',
//     //   error: '/error',
//     },
//   }
// );

// export const config = {
//   matcher: [
//     '/applicant/:path*',
//     '/admin/:path*',
//     '/manager/:path*',
//     '/reviewer/:path*',
//   ],
// };

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(request: NextRequest) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    console.log("Middleware triggered");
    
    if (!token) {
      console.log(`Middleware: No token, redirecting to /signin from ${pathname}`);
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    const role = token?.role || 'applicant';

    const roleRedirects: { [key: string]: string } = {
      admin: '/admin',
      manager: '/manager',
      reviewer: '/reviewer',
      applicant: '/applicant',
    };

    const redirectUrl = roleRedirects[role] || '/applicant';

    if (pathname.startsWith('/admin') && role !== 'admin') {
      console.log(`Middleware: Unauthorized admin access by ${role}, redirecting to ${redirectUrl}`);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    if (pathname.startsWith('/manager') && role !== 'manager') {
      console.log(`Middleware: Unauthorized manager access by ${role}, redirecting to ${redirectUrl}`);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    if (pathname.startsWith('/reviewer') && role !== 'reviewer') {
      console.log(`Middleware: Unauthorized reviewer access by ${role}, redirecting to ${redirectUrl}`);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    if (pathname.startsWith('/applicant') && role !== 'applicant') {
      console.log(`Middleware: Unauthorized applicant access by ${role}, redirecting to ${redirectUrl}`);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/signin',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/manager/:path*',
    '/reviewer/:path*',
    '/applicant/:path*',
  ],
};
