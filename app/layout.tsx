// app/layout.tsx
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'  // 👈 Добавь импорт
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'MethodX - Методическая копилка',
  description: 'Платформа для обмена учебными материалами',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userWithRole = null
  if (user) {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', user.id)
      .single()

    userWithRole = {
      email: user.email || '',
      role: data?.role || 'student',
    }
  }

  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Header user={userWithRole} />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}