// safeGet.ts

export function string<T extends Record<string, any>>(
  obj: T,
  key: keyof T,
  defaultValue: string
): string {
  if (obj && key in obj) {
    const value = obj[key]
    if (typeof value === 'string') {
      return value
    }
  }
  return defaultValue
}

export function number<T extends Record<string, any>>(
  obj: T,
  key: keyof T,
  defaultValue: number
): number {
  if (obj && key in obj) {
    const value = obj[key]
    if (typeof value === 'number') {
      return value
    }
  }
  return defaultValue
}

export function boolean<T extends Record<string, any>>(
  obj: T,
  key: keyof T,
  defaultValue: boolean
): boolean {
  if (obj && key in obj) {
    const value = obj[key]
    if (typeof value === 'boolean') {
      return value
    }
  }
  return defaultValue
}

export function obj<T extends Record<string, any>, U>(
  obj: T,
  key: keyof T,
  defaultValue: U
): U {
  if (obj && key in obj) {
    const value = obj[key]
    if (typeof value === 'object' && value !== null) {
      return value as U
    }
  }
  return defaultValue
}

export const safeGet = {
  string,
  number,
  boolean,
  obj
}
