// lib/types.ts
// Типы для всех сущностей в проекте

export type UserRole = 'student' | 'teacher'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name?: string
}

export interface Lecture {
  id: string
  title: string
  description?: string
  content?: string
  file_url?: string
  views: number
  author_id: string
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  views: number
  author_id: string
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  title: string
  description?: string
  photo_url: string
  views: number
  author_id: string
  created_at: string
}

export interface Experience {
  id: string
  title: string
  content: string
  views: number
  author_id: string
  author?: User
  created_at: string
  updated_at: string
}

export interface ExperienceComment {
  id: string
  experience_id: string
  author_id: string
  author?: User
  content: string
  created_at: string
}

export interface StudentProgress {
  id: string
  student_id: string
  lecture_id?: string
  video_id?: string
  is_completed: boolean
  completed_at?: string
  created_at: string
}

// НПА - Нормативно-правовые акты
export interface NPA {
  id: string
  title: string
  description?: string
  document_number: string
  document_type: 'law' | 'regulation' | 'order' | 'instruction' | 'letter' | 'other'
  approval_date: string
  file_url?: string
  external_link?: string
  category: string
  tags?: string[]
  views: number
  created_at: string
  updated_at: string
}

// ГОСО - Государственные образовательные стандарты
export interface GOSO {
  id: string
  title: string
  description?: string
  subject: string
  grade_level: string
  document_number: string
  approval_date: string
  file_url?: string
  external_link?: string
  views: number
  created_at: string
  updated_at: string
}

// Типовые правила
export interface TypicalRules {
  id: string
  title: string
  description?: string
  rule_type: string
  document_number: string
  approval_date: string
  file_url?: string
  external_link?: string
  views: number
  created_at: string
  updated_at: string
}

// Вопросы и ответы
export interface QA {
  id: string
  question: string
  answer: string
  category: string
  author_id?: string
  author?: User
  is_approved: boolean
  views: number
  helpful_count: number
  created_at: string
  updated_at: string
}

// FAQ - Часто задаваемые вопросы
export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order_number: number
  views: number
  created_at: string
  updated_at: string
}

// Инклюзия в образовании
export interface InclusiveEducation {
  id: string
  title: string
  content: string
  resource_type: 'article' | 'guide' | 'methodology' | 'case_study' | 'video' | 'other'
  disability_type?: string[]
  grade_level?: string
  subject?: string
  file_url?: string
  video_url?: string
  external_link?: string
  author_id?: string
  author?: User
  views: number
  created_at: string
  updated_at: string
}

// Категории для организации контента
export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  parent_id?: string
  order_number: number
  created_at: string
}