// app/admin/lectures/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DeleteButton from './DeleteButton'
import { formatDate } from '@/lib/utils'

export default async function AdminLecturesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Получаем только свои лекции
  const { data: lectures } = await supabase
    .from('lectures')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Управление лекциями</h1>
        <Link href="/admin/lectures/new">
          <Button>Создать лекцию</Button>
        </Link>
      </div>

      {!lectures || lectures.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            У вас пока нет лекций
          </p>
          <Link href="/admin/lectures/new">
            <Button>Создать первую лекцию</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {lectures.map((lecture) => (
            <Card key={lecture.id}>
              <CardHeader>
                <h3>{lecture.title}</h3>
              </CardHeader>
              <CardContent>
                <p>{lecture.description || 'Без описания'}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                  👁 {lecture.views} просмотров • {formatDate(lecture.created_at)}
                </div>
              </CardContent>
              <CardFooter>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <Link href={`/lectures/${lecture.id}`} style={{ flex: 1 }}>
                    <Button variant="secondary" style={{ width: '100%' }}>
                      Просмотр
                    </Button>
                  </Link>
                  <DeleteButton id={lecture.id} title={lecture.title} type="lecture" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}