import type { ZodType } from 'zod';

export const storage = {
  get: <T>(key: string, schema: ZodType<T>): T | null => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      return schema.safeParse(JSON.parse(saved)).data ?? null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: unknown) =>
    localStorage.setItem(key, JSON.stringify(value)),
  remove: (key: string) => localStorage.removeItem(key),
};
