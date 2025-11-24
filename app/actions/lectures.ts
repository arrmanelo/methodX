'use server'

// app/actions/lectures.ts
// Server Actions для работы с лекциями

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Lecture } from '@/lib/types'

// Получить все лекции
export async function getLectures(): Promise<Lecture[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lectures:', error)
    return []
  }

  return data || []
}

// Получить одну лекцию по ID
export async function getLecture(id: string): Promise<Lecture | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching lecture:', error)
    return null
  }

  // Увеличиваем счетчик просмотров
  await supabase
    .from('lectures')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', id)

  return data
}

// Создать новую лекцию
export async function createLecture(formData: FormData) {
  const supabase = await createClient()
  
  // Получаем текущего пользователя
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  // Получаем данные из формы
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const file = formData.get('file') as File | null

  if (!title) {
    return { error: 'Название обязательно' }
  }

  let fileUrl: string | null = null

  // Загружаем файл если есть
  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('lectures')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return { error: 'Ошибка загрузки файла' }
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from('lectures')
      .getPublicUrl(fileName)
    
    fileUrl = urlData.publicUrl
  }

  // Создаем лекцию
  const { error: insertError } = await supabase
    .from('lectures')
    .insert({
      title,
      description: description || null,
      content: content || null,
      file_url: fileUrl,
      author_id: user.id,
    })

  if (insertError) {
    console.error('Error creating lecture:', insertError)
    return { error: 'Ошибка создания лекции' }
  }

  // Обновляем кэш страницы
  revalidatePath('/lectures')
  revalidatePath('/admin')

  return { success: true }
}

// Обновить лекцию
export async function updateLecture(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const file = formData.get('file') as File | null

  if (!title) {
    return { error: 'Название обязательно' }
  }

  let fileUrl: string | null = null

  // Загружаем новый файл если есть
  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('lectures')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return { error: 'Ошибка загрузки файла' }
    }

    const { data: urlData } = supabase.storage
      .from('lectures')
      .getPublicUrl(fileName)
    
    fileUrl = urlData.publicUrl
  }

  // Обновляем лекцию
  const updateData: any = {
    title,
    description: description || null,
    content: content || null,
    updated_at: new Date().toISOString(),
  }

  if (fileUrl) {
    updateData.file_url = fileUrl
  }

  const { error: updateError } = await supabase
    .from('lectures')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id) // Только автор может обновлять

  if (updateError) {
    console.error('Error updating lecture:', updateError)
    return { error: 'Ошибка обновления лекции' }
  }

  revalidatePath('/lectures')
  revalidatePath(`/lectures/${id}`)
  revalidatePath('/admin')

  return { success: true }
}

// Удалить лекцию
export async function deleteLecture(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const { error } = await supabase
    .from('lectures')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id) // Только автор может удалять

  if (error) {
    console.error('Error deleting lecture:', error)
    return { error: 'Ошибка удаления лекции' }
  }

  revalidatePath('/lectures')
  revalidatePath('/admin')

  return { success: true }
}