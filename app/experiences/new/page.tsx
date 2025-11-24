// app/experiences/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createExperience } from '@/app/actions/experiences'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'

export default function NewExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const result = await createExperience(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    alert('Статья успешно опубликована!')
    router.push('/experiences')
    router.refresh()
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Поделиться опытом</h1>

        <Card>
          <CardHeader>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Расскажите о своем опыте, методиках и наблюдениях. Ваша статья будет доступна всем пользователям.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#fee',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius)',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {error}
                </div>
              )}

              <Input
                label="Заголовок статьи"
                name="title"
                id="title"
                required
                placeholder="Например: Мой опыт использования интерактивных методов обучения"
              />

              <Textarea
                label="Содержание статьи"
                name="content"
                id="content"
                required
                placeholder="Подробно опишите свой опыт, выводы и рекомендации..."
                rows={15}
              />

              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                💡 Совет: Структурируйте текст, используйте абзацы для лучшей читаемости
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit" isLoading={loading} disabled={loading}>
                  Опубликовать статью
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}