// middleware.ts (FINAL, CLEAN VERSION)

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Re-add the type import

// Define the protected routes you want to enforce login for
const PROTECTED_ROUTES = [
    '/dashboard',
    '/report',
    '/consumption',
];

// Use the default export AND the correct type annotation
export default async function middleware(req: NextRequest) { 
    const res = NextResponse.next();
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Restore types for correct TypeScript functionality
                get: (name: string) => req.cookies.get(name)?.value, 
                set: (name: string, value: string, options: any) => { 
                    req.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    res.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove: (name: string, options: any) => {
                    req.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    res.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    await supabase.auth.getSession();
    const url = req.nextUrl.clone();
    const { data: { session } } = await supabase.auth.getSession();
    const isProtectedRoute = PROTECTED_ROUTES.some(route => url.pathname.startsWith(route));

    if (isProtectedRoute && !session) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
    
    if (session && (url.pathname === '/login' || url.pathname === '/signup')) {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt).*)',
    ],
};