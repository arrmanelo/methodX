// app/admin/lectures/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLecture } from '@/app/actions/lectures'
import Input, { Textarea, FileInput } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'

export default function NewLecturePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const result = await createLecture(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    alert('Лекция успешно создана!')
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Создать лекцию</h1>

        <Card>
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
                label="Название лекции"
                name="title"
                id="title"
                required
                placeholder="Введите название лекции"
              />

              <Textarea
                label="Описание"
                name="description"
                id="description"
                placeholder="Краткое описание лекции (необязательно)"
                rows={3}
              />

              <Textarea
                label="Содержание"
                name="content"
                id="content"
                placeholder="Полный текст лекции (необязательно)"
                rows={10}
              />

              <FileInput
                label="Файл лекции"
                name="file"
                id="file"
                accept=".pdf,.doc,.docx,.txt"
              />

              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Поддерживаемые форматы: PDF, DOC, DOCX, TXT
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit" isLoading={loading} disabled={loading}>
                  Создать лекцию
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