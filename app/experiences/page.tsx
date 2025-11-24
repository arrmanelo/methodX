// app/experiences/page.tsx
import { getExperiences } from '@/app/actions/experiences'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDate, truncateText } from '@/lib/utils'

export default async function ExperiencesPage() {
  const experiences = await getExperiences()

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Обмен опытом</h1>
        <Link href="/experiences/new">
          <Button>Создать статью</Button>
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Пока нет статей
          </p>
          <Link href="/experiences/new">
            <Button>Создать первую статью</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {experiences.map((experience) => (
            <Link key={experience.id} href={`/experiences/${experience.id}`} style={{ textDecoration: 'none' }}>
              <Card hoverable>
                <CardHeader>
                  <h3>{experience.title}</h3>
                </CardHeader>
                <CardContent>
                  <p>{truncateText(experience.content, 150)}</p>
                  <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                    👁 {experience.views} просмотров • {formatDate(experience.created_at)}
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