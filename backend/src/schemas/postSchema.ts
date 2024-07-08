import { z } from 'zod';

import { allowedLanguages } from '../models/post.model';

export const postSchema = z.object({
  title: z.string().max(200).trim(),
  language: z.enum(allowedLanguages),
  content: z.string().max(10000),
  description: z.string().max(40000).trim(),
  community: z.string().trim().optional(),
});
