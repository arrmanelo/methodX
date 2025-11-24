import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Обновляем сессию пользователя
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Защита админских роутов - только для учителей
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Не авторизован - редирект на логин
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: userData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'teacher') {
      // Не учитель - редирект на главную
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}