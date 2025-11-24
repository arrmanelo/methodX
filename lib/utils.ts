// lib/utils.ts
// Вспомогательные функции для всего приложения

import { type ClassValue, clsx } from 'clsx'

// Функция для объединения классов CSS
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Форматирование даты
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Форматирование даты и времени
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Обрезка текста до определенной длины
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Получение URL для Supabase Storage
export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

// Валидация email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Получение инициалов из имени
export function getInitials(name?: string): string {
  if (!name) return '?'
  const names = name.split(' ')
  if (names.length === 1) return names[0][0].toUpperCase()
  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}