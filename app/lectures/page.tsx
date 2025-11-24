// app/lectures/page.tsx
import { getLectures } from '@/app/actions/lectures'
import Link from 'next/link'
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

export default async function LecturesPage() {
  const lectures = await getLectures()

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Лекции</h1>
      </div>

      {lectures.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            Пока нет лекций
          </p>
        </div>
      ) : (
        <div className="grid grid-3">
          {lectures.map((lecture) => (
            <Link key={lecture.id} href={`/lectures/${lecture.id}`} style={{ textDecoration: 'none' }}>
              <Card hoverable>
                <CardHeader>
                  <h3>{lecture.title}</h3>
                </CardHeader>
                <CardContent>
                  <p>{lecture.description || 'Без описания'}</p>
                  <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                    👁 {lecture.views} просмотров • {formatDate(lecture.created_at)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}