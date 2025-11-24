// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Неверный email или пароль')
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Card>
          <CardHeader>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Вход в систему</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>
              Войдите в свой аккаунт
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin}>
              {error && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#fee',
                  color: 'var(--danger)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />

              <Input
                label="Пароль"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                style={{ width: '100%' }}
                isLoading={loading}
                disabled={loading}
              >
                Войти
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p style={{ textAlign: 'center', margin: 0, fontSize: '0.875rem' }}>
              Нет аккаунта?{' '}
              <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Зарегистрироваться
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}