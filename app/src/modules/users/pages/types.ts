import type React from 'react'
import type { User } from '../domain/types'

export type UserFormValues = {
  name: string
  email: string
  matricula: string
  password: string
  confirmPassword: string
}

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>

export type UserFormLayoutProps = {
  mode: 'create' | 'edit'
  title: string
  breadcrumbLabel: string
  primaryButtonLabel: string
  submitting: boolean
  canSubmit: boolean
  values: UserFormValues
  errors: UserFormErrors
  onChange: (field: keyof UserFormValues, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export type UserRowProps = {
  user: User
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export type ActionIconButtonProps = {
  children: React.ReactNode
  onClick: () => void
  'aria-label': string
}

export type PaginationButtonProps = {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  'aria-label': string
}

