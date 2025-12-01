'use server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function saveTest(lectureId: string, questions: any) {
  const { error } = await supabase.from('tests').insert({
    lecture_id: lectureId,
    questions
  })

  if (error) {
    console.error("Error saving test:", error)
    return false
  }
  return true
}
