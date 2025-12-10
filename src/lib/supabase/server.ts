// src/lib/supabase/server.ts (FINAL, FINAL FIX - DOUBLE CAST)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers' 
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const createServerSupabaseClient = () => {
 // Convert to 'unknown' first, then to the target type to bypass TS error
 const cookieStore = cookies() as unknown as ReadonlyRequestCookies; 

 return createServerClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
   {
     cookies: {
       get(name: string) {
         return cookieStore.get(name)?.value
       },
       set(name: string, value: string, options: CookieOptions) {
         cookieStore.set(name, value, options as any) 
       },
       remove(name: string, options: CookieOptions) {
         cookieStore.set(name, '', options as any)
       },
     },
   }
 )
}