// app/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Валидация
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      
      // Регистрация с метаданными (роль и имя)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role, // Сохраняем роль в метаданные пользователя
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Успешная регистрация
      alert('Регистрация успешна! Проверьте email для подтверждения.')
      router.push('/login')
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
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Регистрация</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>
              Создайте новый аккаунт
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister}>
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
                label="Полное имя"
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Иван Иванов"
              />

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
                autoComplete="new-password"
              />

              <Input
                label="Подтвердите пароль"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="new-password"
              />

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: 'var(--text-primary)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Роль <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={(e) => setRole(e.target.value as 'student')}
                    />
                    Студент
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={role === 'teacher'}
                      onChange={(e) => setRole(e.target.value as 'teacher')}
                    />
                    Преподаватель
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                style={{ width: '100%' }}
                isLoading={loading}
                disabled={loading}
              >
                Зарегистрироваться
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p style={{ textAlign: 'center', margin: 0, fontSize: '0.875rem' }}>
              Уже есть аккаунт?{' '}
              <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Войти
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}