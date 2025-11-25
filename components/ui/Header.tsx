'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './Header.module.css'

interface HeaderProps {
  user?: {
    email: string
    role: string
  } | null
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          MethodX
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/lectures" className={isActive('/lectures') ? styles.active : ''}>
            Лекции
          </Link>
          <Link href="/videos" className={isActive('/videos') ? styles.active : ''}>
            Видео
          </Link>
          <Link href="/photos" className={isActive('/photos') ? styles.active : ''}>
            Фото
          </Link>
          <Link href="/experiences" className={isActive('/experiences') ? styles.active : ''}>
            Обмен опытом
          </Link>
          {user?.role === 'teacher' && (
            <Link href="/admin" className={isActive('/admin') ? styles.active : ''}>
              Админ
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className={styles.userMenu}>
          {user ? (
            <div className={styles.userInfo}>
              <span className={styles.email}>{user.email}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Выйти
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Войти
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.menuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/lectures" onClick={() => setIsMenuOpen(false)}>
            Лекции
          </Link>
          <Link href="/videos" onClick={() => setIsMenuOpen(false)}>
            Видео
          </Link>
          <Link href="/photos" onClick={() => setIsMenuOpen(false)}>
            Фото
          </Link>
          <Link href="/experiences" onClick={() => setIsMenuOpen(false)}>
            Обмен опытом
          </Link>
          {user?.role === 'teacher' && (
            <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
              Админ
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} className={styles.mobileLogout}>
              Выйти
            </button>
          )}
        </div>
      )}
    </header>
  )
}