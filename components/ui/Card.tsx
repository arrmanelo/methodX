// components/ui/Card.tsx
import styles from '@/styles/components/card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  return (
    <div
      className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.cardHeader} ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.cardContent} ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.cardFooter} ${className}`}>{children}</div>
}