// components/VirtualAssistant.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './VirtualAssistant.module.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Здравствуйте! Я виртуальный помощник MethodX. Чем могу помочь?',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickQuestions = [
    'Как добавить лекцию?',
    'Где найти НПА?',
    'Как работает генератор тестов?',
    'Что такое ГОСО?',
    'Как поделиться опытом?',
  ]

  const getResponse = (question: string): string => {
    const q = question.toLowerCase()

    if (q.includes('лекц') || q.includes('матери') || q.includes('добав')) {
      return 'Чтобы добавить лекцию:\n1. Войдите в систему как учитель\n2. Перейдите в "Админ-панель"\n3. Выберите "Лекции"\n4. Нажмите "Создать новую лекцию"\n5. Заполните форму и загрузите файл\n\nВаша лекция будет доступна всем пользователям сразу после публикации.'
    }

    if (q.includes('нпа') || q.includes('норматив')) {
      return 'НПА (Нормативно-правовые акты) — это раздел с законами, постановлениями, приказами и другими документами, регулирующими систему образования Казахстана.\n\nВы можете найти их в разделе "НПА" в главном меню. Доступен поиск по типу документа, категории и ключевым словам.'
    }

    if (q.includes('тест') || q.includes('генера')) {
      return 'Генератор тестов с AI работает так:\n1. Откройте любую лекцию\n2. Нажмите "Создать тест"\n3. AI автоматически создаст вопросы на основе содержания лекции\n4. Вы можете отредактировать вопросы\n5. Сохраните тест\n\nИспользуется технология GPT-4 для качественной генерации вопросов.'
    }

    if (q.includes('госо') || q.includes('стандарт')) {
      return 'ГОСО — Государственные образовательные стандарты.\n\nЭто официальные документы, определяющие требования к содержанию образования по всем предметам и уровням.\n\nВы можете найти их в разделе "ГОСО" с возможностью фильтрации по предмету и уровню обучения.'
    }

    if (q.includes('опыт') || q.includes('стат') || q.includes('обмен')) {
      return 'Чтобы поделиться опытом:\n1. Войдите в систему\n2. Перейдите в раздел "Обмен опытом"\n3. Нажмите "Поделиться опытом"\n4. Напишите статью о своем опыте\n5. Опубликуйте\n\nДругие пользователи смогут читать и комментировать вашу статью.'
    }

    if (q.includes('регистр') || q.includes('войти') || q.includes('вход')) {
      return 'Для регистрации:\n1. Нажмите "Регистрация" в верхнем меню\n2. Укажите email и пароль\n3. Выберите роль (учитель или студент)\n4. Подтвердите регистрацию\n\nУчителя имеют расширенные права на создание контента.'
    }

    if (q.includes('инклюз') || q.includes('ооп') || q.includes('особ')) {
      return 'Раздел "Инклюзивное образование" содержит:\n• Методические рекомендации\n• Руководства для учителей\n• Практические кейсы\n• Материалы по работе с детьми с ООП\n\nВы можете фильтровать материалы по типу нозологии и уровню образования.'
    }

    if (q.includes('помощ') || q.includes('поддержк') || q.includes('вопрос')) {
      return 'Для получения помощи:\n• FAQ — часто задаваемые вопросы\n• Q&A — задать вопрос сообществу\n• Этот чат — быстрые ответы\n\nТакже вы можете изучить документацию в соответствующих разделах.'
    }

    if (q.includes('привет') || q.includes('здрав')) {
      return 'Здравствуйте! Рад помочь вам с навигацией по платформе MethodX. Задайте свой вопрос или выберите один из готовых вариантов ниже.'
    }

    if (q.includes('спасибо') || q.includes('благодар')) {
      return 'Пожалуйста! Обращайтесь, если возникнут ещё вопросы. Удачи в работе!'
    }

    if (q.includes('категор') || q.includes('раздел')) {
      return 'На платформе доступны следующие разделы:\n📚 Лекции\n🎥 Видео\n📷 Фотогалерея\n💬 Обмен опытом\n📋 НПА\n📖 ГОСО\n📜 Типовые правила\n🤝 Инклюзивное образование\n❓ FAQ и Q&A\n\nВыберите нужный раздел в меню.'
    }

    return 'Спасибо за вопрос! По этой теме рекомендую:\n\n• Изучить раздел FAQ для общих вопросов\n• Задать вопрос в разделе Q&A для получения детального ответа от сообщества\n• Связаться с администрацией платформы\n\nМогу помочь с навигацией по платформе или ответить на базовые вопросы.'
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(inputValue)
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть виртуального помощника"
      >
        <span className={styles.icon}>💬</span>
      </button>

      {isOpen && (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>🤖</div>
              <div>
                <h3 className={styles.title}>Виртуальный помощник</h3>
                <p className={styles.status}>● Онлайн</p>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                {message.role === 'assistant' && (
                  <div className={styles.messageAvatar}>🤖</div>
                )}
                <div className={styles.messageContent}>
                  <p className={styles.messageText}>{message.content}</p>
                  <span className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageAvatar}>🤖</div>
                <div className={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className={styles.quickQuestions}>
              <p className={styles.quickTitle}>Популярные вопросы:</p>
              <div className={styles.quickButtons}>
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    className={styles.quickBtn}
                    onClick={() => handleQuickQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.input}>
            <input
              type="text"
              placeholder="Введите ваш вопрос..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className={styles.inputField}
            />
            <button
              onClick={handleSend}
              className={styles.sendBtn}
              disabled={!inputValue.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
