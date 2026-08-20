// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const isDashboardRoute = req.nextUrl.pathname.startsWith('/admin/dashboard')
  const isLoginRoute = req.nextUrl.pathname === '/admin'

  // Se não está logado e tenta acessar dashboard
  if (isDashboardRoute && !session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Se está logado na página de login
  if (isLoginRoute && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, ativo')
      .eq('id', session.user.id)
      .single()

    if (profile?.ativo && ['barbeiro', 'admin'].includes(profile?.role)) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  }

  // Se está logado mas não é barbeiro/admin
  if (isDashboardRoute && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, ativo')
      .eq('id', session.user.id)
      .single()

    if (!profile?.ativo || !['barbeiro', 'admin'].includes(profile?.role)) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}