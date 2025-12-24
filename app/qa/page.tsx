// app/qa/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import styles from './qa.module.css'

interface QAItem {
  id: string
  question: string
  answer: string
  category: string
  author: string
  views: number
  helpful_count: number
  created_at: string
}

export default function QAPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAskModal, setShowAskModal] = useState(false)

  const categories = [
    { id: 'all', name: 'Все вопросы', icon: '📚' },
    { id: 'methodology', name: 'Методика преподавания', icon: '📖' },
    { id: 'curriculum', name: 'Учебная программа', icon: '📋' },
    { id: 'assessment', name: 'Оценивание', icon: '✅' },
    { id: 'technology', name: 'Технологии в обучении', icon: '💻' },
    { id: 'classroom', name: 'Управление классом', icon: '👥' },
    { id: 'inclusive', name: 'Инклюзивное образование', icon: '🤝' },
    { id: 'parents', name: 'Работа с родителями', icon: '👨‍👩‍👧' },
    { id: 'career', name: 'Карьера учителя', icon: '🎯' },
    { id: 'other', name: 'Другое', icon: '💡' },
  ]

  // Пример данных (в реальности будут загружаться с сервера)
  const qaItems: QAItem[] = [
    {
      id: '1',
      question: 'Как эффективно организовать дистанционное обучение?',
      answer: 'Для эффективной организации дистанционного обучения рекомендую:\n\n1. Использовать платформы для видеоконференций (Zoom, Google Meet)\n2. Создать чёткое расписание занятий\n3. Использовать интерактивные инструменты (Kahoot, Quizlet)\n4. Обеспечить обратную связь через онлайн-тесты\n5. Записывать лекции для повторного просмотра\n\nВажно поддерживать регулярный контакт с учениками и родителями.',
      category: 'technology',
      author: 'Айгуль Сапарова',
      views: 245,
      helpful_count: 89,
      created_at: '2024-01-15',
    },
    {
      id: '2',
      question: 'Какие методы оценивания наиболее эффективны для начальной школы?',
      answer: 'Для начальной школы эффективны следующие методы:\n\n• Формативное оценивание — регулярная обратная связь\n• Портфолио — накопление работ учащихся\n• Самооценка и взаимооценка\n• Наблюдение за процессом обучения\n• Критериальное оценивание с дескрипторами\n\nВажно сочетать разные методы и фокусироваться на прогрессе ребёнка.',
      category: 'assessment',
      author: 'Марат Токтаров',
      views: 178,
      helpful_count: 56,
      created_at: '2024-01-14',
    },
    {
      id: '3',
      question: 'Как работать с детьми с особыми образовательными потребностями?',
      answer: 'Рекомендации по работе с детьми с ООП:\n\n1. Индивидуальный подход и адаптация программы\n2. Использование вспомогательных технологий\n3. Создание инклюзивной среды в классе\n4. Тесное сотрудничество с родителями и специалистами\n5. Дифференциация заданий по сложности\n6. Использование визуальных и тактильных материалов\n\nВажно регулярно повышать квалификацию в области инклюзивного образования.',
      category: 'inclusive',
      author: 'Гульнара Абдрахманова',
      views: 312,
      helpful_count: 142,
      created_at: '2024-01-13',
    },
  ]

  const filteredQAs = qaItems.filter(qa => {
    const matchesCategory = selectedCategory === 'all' || qa.category === selectedCategory
    const matchesSearch = qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Вопросы и ответы</h1>
        <p className={styles.subtitle}>
          Сообщество учителей делится опытом и отвечает на вопросы коллег
        </p>
        <Button onClick={() => setShowAskModal(true)} className={styles.askBtn}>
          ➕ Задать вопрос
        </Button>
      </header>

      <div className={styles.controls}>
        <input
          type="search"
          placeholder="Поиск по вопросам..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className={styles.categoryIcon}>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.qaList}>
        {filteredQAs.map((qa) => (
          <Card key={qa.id} className={styles.qaCard}>
            <CardHeader>
              <div className={styles.qaHeader}>
                <div className={styles.categoryBadge}>
                  {categories.find(c => c.id === qa.category)?.icon}
                  <span>{categories.find(c => c.id === qa.category)?.name}</span>
                </div>
                <div className={styles.qaStats}>
                  <span>👁 {qa.views}</span>
                  <span>👍 {qa.helpful_count}</span>
                </div>
              </div>
              <h3 className={styles.question}>{qa.question}</h3>
              <p className={styles.author}>
                Автор ответа: {qa.author} • {new Date(qa.created_at).toLocaleDateString('ru-RU')}
              </p>
            </CardHeader>
            <CardContent>
              <div className={styles.answer}>
                <p>{qa.answer}</p>
              </div>
              <div className={styles.qaActions}>
                <button className={styles.helpfulBtn}>
                  👍 Полезно
                </button>
                <button className={styles.commentBtn}>
                  💬 Обсудить
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQAs.length === 0 && (
        <div className={styles.empty}>
          <p>Вопросы не найдены</p>
          <p className={styles.emptyHint}>
            Попробуйте изменить параметры поиска или задайте первый вопрос
          </p>
        </div>
      )}

      {showAskModal && (
        <div className={styles.modal} onClick={() => setShowAskModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Задать вопрос</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowAskModal(false)}
              >
                ✕
              </button>
            </div>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="category">Категория</label>
                <select id="category" className={styles.select}>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="question">Ваш вопрос</label>
                <input
                  id="question"
                  type="text"
                  placeholder="Напишите краткий вопрос..."
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="details">Подробности (опционально)</label>
                <textarea
                  id="details"
                  rows={5}
                  placeholder="Опишите ситуацию подробнее, чтобы получить более точный ответ..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formActions}>
                <Button type="button" variant="secondary" onClick={() => setShowAskModal(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  Опубликовать вопрос
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
