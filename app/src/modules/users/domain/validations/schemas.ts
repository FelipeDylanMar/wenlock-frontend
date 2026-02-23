import { z } from 'zod'

const onlyLetters = /^[a-zA-ZÀ-ÿ\s]+$/
const onlyNumbers = /^\d+$/
const alphanumeric6 = /^[a-zA-Z0-9]{6}$/

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .regex(onlyLetters, 'Nome deve conter apenas letras'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  matricula: z
    .string()
    .min(1, 'Matrícula é obrigatória')
    .regex(onlyNumbers, 'Matrícula deve conter apenas números'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .regex(alphanumeric6, 'Senha deve ser alfanumérica com 6 dígitos'),
})

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(onlyLetters)
    .optional(),
  email: z.string().email().optional(),
  matricula: z.string().regex(onlyNumbers).optional(),
  password: z.string().regex(alphanumeric6).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
