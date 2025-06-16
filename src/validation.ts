import { ValidationError } from './errors.ts'

export function integer (value: string): void {
  const int = parseInt(value)

  if (int.toString() !== value) {
    throw new ValidationError('Value must be an integer')
  }
}

export function positive (value: any): void {
  if (value < 0) {
    throw new ValidationError('Value must be a positive integer, or zero')
  }
}

export function maxValue (max: number): (value: any) => void {
  return (value) => {
    if (value > max) {
      throw new ValidationError(`Value must be smaller than or equal to ${max}`)
    }
  }
}

export function validate (...funcs: Array<(value: string) => void>): (value: string) => void {
  return (value) => {
    for (const fn of funcs) {
      fn(value)
    }
  }
}

export const validatePort = validate(
  integer,
  positive,
  maxValue(65_535)
)
