'use server'

// app/actions/experiences.ts
// Server Actions для работы с опытом (статьями)

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Experience, ExperienceComment } from '@/lib/types'

// Получить все статьи с опытом
export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching experiences:', error)
    return []
  }

  return data || []
}

// Получить одну статью по ID с комментариями
export async function getExperience(id: string) {
  const supabase = await createClient()
  
  const { data: experience, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching experience:', error)
    return null
  }

  // Увеличиваем просмотры
  await supabase
    .from('experiences')
    .update({ views: (experience.views || 0) + 1 })
    .eq('id', id)

  // Получаем комментарии
  const { data: comments } = await supabase
    .from('experience_comments')
    .select('*')
    .eq('experience_id', id)
    .order('created_at', { ascending: true })

  return {
    experience,
    comments: comments || []
  }
}

// Создать новую статью с опытом
export async function createExperience(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    return { error: 'Название и содержание обязательны' }
  }

  const { error: insertError } = await supabase
    .from('experiences')
    .insert({
      title,
      content,
      author_id: user.id,
    })

  if (insertError) {
    console.error('Error creating experience:', insertError)
    return { error: 'Ошибка создания статьи' }
  }

  revalidatePath('/experiences')

  return { success: true }
}

// Обновить статью
export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    return { error: 'Название и содержание обязательны' }
  }

  const { error: updateError } = await supabase
    .from('experiences')
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('author_id', user.id)

  if (updateError) {
    console.error('Error updating experience:', updateError)
    return { error: 'Ошибка обновления статьи' }
  }

  revalidatePath('/experiences')
  revalidatePath(`/experiences/${id}`)

  return { success: true }
}

// Удалить статью
export async function deleteExperience(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    console.error('Error deleting experience:', error)
    return { error: 'Ошибка удаления статьи' }
  }

  revalidatePath('/experiences')

  return { success: true }
}

// Добавить комментарий
export async function addComment(experienceId: string, content: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  if (!content.trim()) {
    return { error: 'Комментарий не может быть пустым' }
  }

  const { error: insertError } = await supabase
    .from('experience_comments')
    .insert({
      experience_id: experienceId,
      author_id: user.id,
      content: content.trim(),
    })

  if (insertError) {
    console.error('Error adding comment:', insertError)
    return { error: 'Ошибка добавления комментария' }
  }

  revalidatePath(`/experiences/${experienceId}`)

  return { success: true }
}

// Удалить комментарий
export async function deleteComment(commentId: string, experienceId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const { error } = await supabase
    .from('experience_comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', user.id)

  if (error) {
    console.error('Error deleting comment:', error)
    return { error: 'Ошибка удаления комментария' }
  }

  revalidatePath(`/experiences/${experienceId}`)

  return { success: true }
}