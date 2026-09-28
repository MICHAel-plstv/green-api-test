import { z } from 'zod';

export const credentialsSchema = z.object({
  apiUrl: z.string(),
  idInstance: z.string(),
  apiTokenInstance: z.string(),
});

export type Credentials = z.infer<typeof credentialsSchema>;
