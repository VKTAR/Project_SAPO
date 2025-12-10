// src/app/auth/signout/route.ts

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    const supabase = createServerSupabaseClient(); // Pass to client
    
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL('/login', req.url), { status: 302 });
}