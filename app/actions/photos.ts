'use server'

// app/actions/photos.ts
// Server Actions для работы с фото

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Photo } from '@/lib/types'

// Получить все фото
export async function getPhotos(): Promise<Photo[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching photos:', error)
    return []
  }

  return data || []
}

// Получить одно фото по ID
export async function getPhoto(id: string): Promise<Photo | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching photo:', error)
    return null
  }

  // Увеличиваем счетчик просмотров
  await supabase
    .from('photos')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', id)

  return data
}

// Создать новое фото
export async function createPhoto(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const photoFile = formData.get('photo') as File | null

  if (!title) {
    return { error: 'Название обязательно' }
  }

  if (!photoFile || photoFile.size === 0) {
    return { error: 'Необходимо загрузить фото' }
  }

  // Очищаем имя файла от спецсимволов и пробелов
  const cleanFileName = photoFile.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')  // Заменяем спецсимволы на _
    .replace(/\s+/g, '_')              // Заменяем пробелы на _
  
  const fileName = `${Date.now()}-${cleanFileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, photoFile)

  if (uploadError) {
    console.error('Error uploading photo:', uploadError)
    return { error: 'Ошибка загрузки фото' }
  }

  const { data: urlData } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName)

  // Создаем запись о фото
  const { error: insertError } = await supabase
    .from('photos')
    .insert({
      title,
      description: description || null,
      photo_url: urlData.publicUrl,
      author_id: user.id,
    })

  if (insertError) {
    console.error('Error creating photo:', insertError)
    return { error: 'Ошибка создания фото' }
  }

  revalidatePath('/photos')
  revalidatePath('/admin')

  return { success: true }
}

// Обновить фото
export async function updatePhoto(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const photoFile = formData.get('photo') as File | null

  if (!title) {
    return { error: 'Название обязательно' }
  }

  const updateData: any = {
    title,
    description: description || null,
  }

  // Загружаем новое фото если есть
  if (photoFile && photoFile.size > 0) {
    const fileName = `${Date.now()}-${photoFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, photoFile)

    if (uploadError) {
      console.error('Error uploading photo:', uploadError)
      return { error: 'Ошибка загрузки фото' }
    }

    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName)

    updateData.photo_url = urlData.publicUrl
  }

  const { error: updateError } = await supabase
    .from('photos')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id)

  if (updateError) {
    console.error('Error updating photo:', updateError)
    return { error: 'Ошибка обновления фото' }
  }

  revalidatePath('/photos')
  revalidatePath(`/photos/${id}`)
  revalidatePath('/admin')

  return { success: true }
}

// Удалить фото
export async function deletePhoto(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    console.error('Error deleting photo:', error)
    return { error: 'Ошибка удаления фото' }
  }

  revalidatePath('/photos')
  revalidatePath('/admin')

  return { success: true }
}