import { z } from 'zod';

import { deriveApiUrl } from './utils';

export const loginSchema = z
  .object({
    idInstance: z
      .string()
      .trim()
      .min(1, 'Введите Instance ID'),
    apiTokenInstance: z.string().trim().min(1, 'Введите Token Instance API'),
    apiUrl: z
      .string()
      .trim()
      .refine((url) => !url || URL.canParse(url), 'Некорректный адрес'),
  })
  .transform(({ apiUrl, ...rest }) => ({
    ...rest,
    apiUrl: apiUrl ? apiUrl.replace(/\/+$/, '') : deriveApiUrl(rest.idInstance),
  }));
