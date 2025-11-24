// proxy.ts
// Proxy для защиты роутов и обновления сессии

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Применяем proxy ко всем роутам кроме:
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico (иконка)
     * - public папка
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}