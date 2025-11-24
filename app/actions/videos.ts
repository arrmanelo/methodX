'use server'

// app/actions/videos.ts
// Server Actions для работы с видео

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Video } from '@/lib/types'

// Получить все видео
export async function getVideos(): Promise<Video[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
    return []
  }

  return data || []
}

// Получить одно видео по ID
export async function getVideo(id: string): Promise<Video | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching video:', error)
    return null
  }

  // Увеличиваем счетчик просмотров
  await supabase
    .from('videos')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', id)

  return data
}

// Создать новое видео
export async function createVideo(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const videoUrl = formData.get('videoUrl') as string | null
  const thumbnailUrl = formData.get('thumbnailUrl') as string | null
  const videoFile = formData.get('video') as File | null
  const thumbnailFile = formData.get('thumbnail') as File | null

  if (!title) {
    return { error: 'Название обязательно' }
  }

  let finalVideoUrl: string
  let finalThumbnailUrl: string | null = null

  // Если добавляется по ссылке
  if (videoUrl) {
    finalVideoUrl = videoUrl
    finalThumbnailUrl = thumbnailUrl || null
  } 
  // Если загружается файл
  else if (videoFile && videoFile.size > 0) {
    // Загружаем видео файл
    const videoFileName = `${Date.now()}-${videoFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(videoFileName, videoFile)

    if (uploadError) {
      console.error('Error uploading video:', uploadError)
      return { error: 'Ошибка загрузки видео' }
    }

    const { data: videoUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(videoFileName)

    finalVideoUrl = videoUrlData.publicUrl

    // Загружаем превью если есть
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailFileName = `thumb-${Date.now()}-${thumbnailFile.name}`
      const { error: thumbError } = await supabase.storage
        .from('videos')
        .upload(thumbnailFileName, thumbnailFile)

      if (!thumbError) {
        const { data: thumbUrlData } = supabase.storage
          .from('videos')
          .getPublicUrl(thumbnailFileName)
        finalThumbnailUrl = thumbUrlData.publicUrl
      }
    }
  } else {
    return { error: 'Необходимо указать ссылку на видео или загрузить файл' }
  }

  // Создаем запись о видео
  const { error: insertError } = await supabase
    .from('videos')
    .insert({
      title,
      description: description || null,
      video_url: finalVideoUrl,
      thumbnail_url: finalThumbnailUrl,
      author_id: user.id,
    })

  if (insertError) {
    console.error('Error creating video:', insertError)
    return { error: 'Ошибка создания видео' }
  }

  revalidatePath('/videos')
  revalidatePath('/admin')

  return { success: true }
}

// Обновить видео
export async function updateVideo(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const videoFile = formData.get('video') as File | null
  const thumbnailFile = formData.get('thumbnail') as File | null

  if (!title) {
    return { error: 'Название обязательно' }
  }

  const updateData: any = {
    title,
    description: description || null,
    updated_at: new Date().toISOString(),
  }

  // Загружаем новое видео если есть
  if (videoFile && videoFile.size > 0) {
    const videoFileName = `${Date.now()}-${videoFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(videoFileName, videoFile)

    if (uploadError) {
      console.error('Error uploading video:', uploadError)
      return { error: 'Ошибка загрузки видео' }
    }

    const { data: videoUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(videoFileName)

    updateData.video_url = videoUrlData.publicUrl
  }

  // Загружаем новое превью если есть
  if (thumbnailFile && thumbnailFile.size > 0) {
    const thumbnailFileName = `thumb-${Date.now()}-${thumbnailFile.name}`
    const { error: thumbError } = await supabase.storage
      .from('videos')
      .upload(thumbnailFileName, thumbnailFile)

    if (!thumbError) {
      const { data: thumbUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(thumbnailFileName)
      updateData.thumbnail_url = thumbUrlData.publicUrl
    }
  }

  const { error: updateError } = await supabase
    .from('videos')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id)

  if (updateError) {
    console.error('Error updating video:', updateError)
    return { error: 'Ошибка обновления видео' }
  }

  revalidatePath('/videos')
  revalidatePath(`/videos/${id}`)
  revalidatePath('/admin')

  return { success: true }
}

// Удалить видео
export async function deleteVideo(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Необходима авторизация' }
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    console.error('Error deleting video:', error)
    return { error: 'Ошибка удаления видео' }
  }

  revalidatePath('/videos')
  revalidatePath('/admin')

  return { success: true }
}