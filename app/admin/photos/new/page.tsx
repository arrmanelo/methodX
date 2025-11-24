// app/admin/photos/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPhoto } from '@/app/actions/photos'
import Input, { Textarea, FileInput } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'

export default function NewPhotoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const result = await createPhoto(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    alert('Фото успешно загружено!')
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Добавить фото</h1>

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
                label="Название фото"
                name="title"
                id="title"
                required
                placeholder="Введите название фото"
              />

              <Textarea
                label="Описание"
                name="description"
                id="description"
                placeholder="Краткое описание фото (необязательно)"
                rows={3}
              />

              <FileInput
                label="Фото"
                name="photo"
                id="photo"
                accept="image/*"
                required
                onChange={handleFileChange}
              />

              {preview && (
                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    Предварительный просмотр:
                  </p>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
              )}

              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Поддерживаемые форматы: JPG, PNG, GIF, WEBP
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit" isLoading={loading} disabled={loading}>
                  Загрузить фото
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