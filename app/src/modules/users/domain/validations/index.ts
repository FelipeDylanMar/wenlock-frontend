import type { CreateUserPayload, UpdateUserPayload } from '../types'
import { createUserSchema, updateUserSchema } from './schemas'

export { createUserSchema, updateUserSchema } from './schemas'
export type { CreateUserInput, UpdateUserInput } from './schemas'

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

function toErrorMap(flat: Record<string, string[]>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(flat)) {
    if (v?.[0]) out[k] = v[0]
  }
  return out
}

export function validateCreateUser(payload: CreateUserPayload): ValidationResult<CreateUserPayload> {
  const result = createUserSchema.safeParse(payload)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: toErrorMap(result.error.flatten().fieldErrors) }
}

export function validateUpdateUser(payload: UpdateUserPayload): ValidationResult<UpdateUserPayload> {
  const result = updateUserSchema.safeParse(payload)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: toErrorMap(result.error.flatten().fieldErrors) }
}

export function isCreateUserValid(payload: CreateUserPayload): boolean {
  return createUserSchema.safeParse(payload).success
}

export function isUpdateUserValid(payload: UpdateUserPayload): boolean {
  return updateUserSchema.safeParse(payload).success
}
