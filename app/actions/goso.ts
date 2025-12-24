// app/actions/goso.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { GOSO } from '@/lib/types'

export async function getGOSOs(): Promise<GOSO[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('goso')
    .select('*')
    .order('approval_date', { ascending: false })

  if (error) {
    console.error('Error fetching GOSOs:', error)
    return []
  }

  return data || []
}

export async function getGOSO(id: string): Promise<GOSO | null> {
  const supabase = await createClient()

  // Increment views
  await supabase
    .from('goso')
    .update({ views: supabase.raw('views + 1') })
    .eq('id', id)

  const { data, error } = await supabase
    .from('goso')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching GOSO:', error)
    return null
  }

  return data
}

export async function createGOSO(formData: FormData): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const subject = formData.get('subject') as string
  const grade_level = formData.get('grade_level') as string
  const document_number = formData.get('document_number') as string
  const approval_date = formData.get('approval_date') as string
  const external_link = formData.get('external_link') as string
  const file = formData.get('file') as File | null

  let file_url: string | undefined

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `goso/${fileName}`

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
    .from('goso')
    .insert({
      title,
      description,
      subject,
      grade_level,
      document_number,
      approval_date,
      file_url,
      external_link: external_link || undefined,
      views: 0,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/goso')
  return { success: true, id: data.id }
}

export async function deleteGOSO(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('goso')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/goso')
  return { success: true }
}
