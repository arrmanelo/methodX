// components/ui/Input.tsx
import styles from '@/styles/components/form.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input className={`${styles.input} ${error ? styles.inputError : ''} ${className}`} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea className={`${styles.textarea} ${error ? styles.inputError : ''} ${className}`} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function FileInput({ label, error, className = '', ...props }: FileInputProps) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input type="file" className={`${styles.fileInput} ${error ? styles.inputError : ''} ${className}`} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}