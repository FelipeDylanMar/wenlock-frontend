import { z } from 'zod'

const onlyLetters = /^[a-zA-ZÀ-ÿ\s]+$/
const onlyNumbers = /^\d+$/
const onlyAlphanumeric = /^[a-zA-Z0-9]+$/

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
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .regex(onlyAlphanumeric, 'Senha deve conter apenas letras e números'),
})

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(onlyLetters)
    .optional(),
  email: z.string().email().optional(),
  matricula: z.string().regex(onlyNumbers).optional(),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres alfanuméricos')
    .regex(onlyAlphanumeric, 'Senha deve conter apenas letras e números')
    .optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
