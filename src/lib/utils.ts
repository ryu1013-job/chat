import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')
