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