// app/experiences/[id]/CommentForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addComment } from '@/app/actions/experiences'
import { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function CommentForm({ experienceId }: { experienceId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await addComment(experienceId, content)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setContent('')
    setLoading(false)
    router.refresh()
  }

  return (
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

      <Textarea
        label="Добавить комментарий"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Поделитесь своими мыслями..."
        rows={3}
        required
      />

      <Button type="submit" isLoading={loading} disabled={loading}>
        Отправить комментарий
      </Button>
    </form>
  )
}