// app/actions/inclusive-education.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { InclusiveEducation } from '@/lib/types'

export async function getInclusiveResources(): Promise<InclusiveEducation[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('inclusive_education')
    .select('*, author:users(id, full_name, email)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inclusive education resources:', error)
    return []
  }

  return data || []
}

export async function getInclusiveResource(id: string): Promise<InclusiveEducation | null> {
  const supabase = await createClient()

  // Increment views
  await supabase
    .from('inclusive_education')
    .update({ views: supabase.raw('views + 1') })
    .eq('id', id)

  const { data, error } = await supabase
    .from('inclusive_education')
    .select('*, author:users(id, full_name, email)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching inclusive education resource:', error)
    return null
  }

  return data
}

export async function createInclusiveResource(formData: FormData): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Необходима авторизация' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const resource_type = formData.get('resource_type') as string
  const disability_type = formData.get('disability_type') as string
  const grade_level = formData.get('grade_level') as string
  const subject = formData.get('subject') as string
  const external_link = formData.get('external_link') as string
  const file = formData.get('file') as File | null

  let file_url: string | undefined

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `inclusive/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    file_url = publicUrl
  }

  const { data, error } = await supabase
    .from('inclusive_education')
    .insert({
      title,
      content,
      resource_type,
      disability_type: disability_type ? disability_type.split(',').map(t => t.trim()) : [],
      grade_level: grade_level || undefined,
      subject: subject || undefined,
      file_url,
      external_link: external_link || undefined,
      author_id: user.id,
      views: 0,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/inclusive-education')
  return { success: true, id: data.id }
}

export async function deleteInclusiveResource(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('inclusive_education')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/inclusive-education')
  return { success: true }
}
