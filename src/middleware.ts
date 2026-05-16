import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const rolePaths = {
    "ADMINISTRATOR": "/administrator",
    "ADMIN": "/admin", 
    "MEDICAL_STAFF": "/medical-staff",
    "CUSTOMER": "/customer",
};

export async function middleware(req: NextRequest) {
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = String(token?.role || "").toUpperCase();

    const redirectToRoleDashboard = () => {
        return NextResponse.redirect(new URL(`${rolePaths[role as keyof typeof rolePaths]}`, req.url));
    };

    const redirectToLogin = () => {
        return NextResponse.redirect(new URL('/login', req.url));
    };

    // Jika pengguna berada di halaman login/register dan sudah terautentikasi, arahkan ke dashboard mereka
    if ((req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') && token) {
        return redirectToRoleDashboard();
    }

    // Periksa jika pengguna mencoba mengakses jalur dashboard atau subpathnya tanpa login
    for (const path of Object.values(rolePaths)) {
        if (req.nextUrl.pathname.startsWith(path) && !token) {
            return redirectToLogin();
        }
    }

    // Periksa jika pengguna mencoba mengakses jalur yang tidak sesuai dengan peran mereka
    for (const [roleKey, path] of Object.entries(rolePaths)) {
        // Jika pengguna mencoba mengakses dashboard role lain
        if (req.nextUrl.pathname.startsWith(path)) {
            // Izinkan akses jika role sesuai
            if (role === roleKey) {
                return NextResponse.next();
            }
            // Redirect ke dashboard sesuai role jika tidak sesuai
            return redirectToRoleDashboard();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      '/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
