// app/admin/lectures/DeleteButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteLecture } from '@/app/actions/lectures'
import { deleteVideo } from '@/app/actions/videos'
import { deletePhoto } from '@/app/actions/photos'
import Button from '@/components/ui/Button'

interface DeleteButtonProps {
  id: string
  title: string
  type: 'lecture' | 'video' | 'photo'
}

export default function DeleteButton({ id, title, type }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Вы уверены что хотите удалить "${title}"?`)) {
      return
    }

    setLoading(true)

    let result
    if (type === 'lecture') {
      result = await deleteLecture(id)
    } else if (type === 'video') {
      result = await deleteVideo(id)
    } else {
      result = await deletePhoto(id)
    }

    if (result.error) {
      alert('Ошибка удаления: ' + result.error)
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      isLoading={loading}
      disabled={loading}
      style={{ flex: 1 }}
    >
      Удалить
    </Button>
  )
}