// app/admin/videos/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVideo } from '@/app/actions/videos'
import Input, { Textarea, FileInput } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'

export default function NewVideoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadType, setUploadType] = useState<'file' | 'link'>('link')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const result = await createVideo(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    alert('Видео успешно добавлено!')
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Добавить видео</h1>

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
                label="Название видео"
                name="title"
                id="title"
                required
                placeholder="Введите название видео"
              />

              <Textarea
                label="Описание"
                name="description"
                id="description"
                placeholder="Краткое описание видео (необязательно)"
                rows={3}
              />

              {/* Выбор типа загрузки */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: 'var(--text-primary)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Способ добавления <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="uploadType"
                      value="link"
                      checked={uploadType === 'link'}
                      onChange={(e) => setUploadType('link')}
                    />
                    Ссылка на видео
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="uploadType"
                      value="file"
                      checked={uploadType === 'file'}
                      onChange={(e) => setUploadType('file')}
                    />
                    Загрузить файл
                  </label>
                </div>
              </div>

              {uploadType === 'link' ? (
                <>
                  <Input
                    label="Ссылка на видео"
                    name="videoUrl"
                    id="videoUrl"
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... или https://vimeo.com/..."
                  />
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Поддерживаются YouTube, Vimeo и другие видеоплатформы
                  </div>

                  <Input
                    label="Ссылка на превью (необязательно)"
                    name="thumbnailUrl"
                    id="thumbnailUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                  />
                </>
              ) : (
                <>
                  <FileInput
                    label="Видео файл"
                    name="video"
                    id="video"
                    accept="video/*"
                    required
                  />

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    ⚠️ Рекомендуется использовать видео до 50 MB. Для больших файлов используйте ссылки.
                  </div>

                  <FileInput
                    label="Превью (необязательно)"
                    name="thumbnail"
                    id="thumbnail"
                    accept="image/*"
                  />
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Button type="submit" isLoading={loading} disabled={loading}>
                  Добавить видео
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