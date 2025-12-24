// app/actions/npa.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { NPA } from '@/lib/types'

export async function getNPAs(): Promise<NPA[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('npa')
    .select('*')
    .order('approval_date', { ascending: false })

  if (error) {
    console.error('Error fetching NPAs:', error)
    return []
  }

  return data || []
}

export async function getNPA(id: string): Promise<NPA | null> {
  const supabase = await createClient()

  // Increment views
  await supabase
    .from('npa')
    .update({ views: supabase.raw('views + 1') })
    .eq('id', id)

  const { data, error } = await supabase
    .from('npa')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching NPA:', error)
    return null
  }

  return data
}

export async function searchNPAs(query: string, filters?: {
  document_type?: string
  category?: string
}): Promise<NPA[]> {
  const supabase = await createClient()

  let queryBuilder = supabase
    .from('npa')
    .select('*')

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,document_number.ilike.%${query}%`)
  }

  if (filters?.document_type) {
    queryBuilder = queryBuilder.eq('document_type', filters.document_type)
  }

  if (filters?.category) {
    queryBuilder = queryBuilder.eq('category', filters.category)
  }

  const { data, error } = await queryBuilder.order('approval_date', { ascending: false })

  if (error) {
    console.error('Error searching NPAs:', error)
    return []
  }

  return data || []
}

export async function createNPA(formData: FormData): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const document_number = formData.get('document_number') as string
  const document_type = formData.get('document_type') as string
  const approval_date = formData.get('approval_date') as string
  const category = formData.get('category') as string
  const tags = formData.get('tags') as string
  const external_link = formData.get('external_link') as string
  const file = formData.get('file') as File | null

  let file_url: string | undefined

  // Upload file if provided
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `npa/${fileName}`

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
    .from('npa')
    .insert({
      title,
      description,
      document_number,
      document_type,
      approval_date,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      file_url,
      external_link: external_link || undefined,
      views: 0,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/npa')
  return { success: true, id: data.id }
}

export async function updateNPA(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const document_number = formData.get('document_number') as string
  const document_type = formData.get('document_type') as string
  const approval_date = formData.get('approval_date') as string
  const category = formData.get('category') as string
  const tags = formData.get('tags') as string
  const external_link = formData.get('external_link') as string
  const file = formData.get('file') as File | null

  const updateData: any = {
    title,
    description,
    document_number,
    document_type,
    approval_date,
    category,
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    external_link: external_link || undefined,
    updated_at: new Date().toISOString(),
  }

  // Upload new file if provided
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `npa/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    updateData.file_url = publicUrl
  }

  const { error } = await supabase
    .from('npa')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/npa')
  revalidatePath(`/npa/${id}`)
  return { success: true }
}

export async function deleteNPA(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('npa')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/npa')
  return { success: true }
}
