import { z } from "zod";


export const validationSchema = z.object({
  NODE_ENV: z.enum(['local', 'dev', 'production']),
  PORT: z.number(),
  CORS_ORIGIN:
    process.env.NODE_ENV === 'production'
      ? z.string().url()
      : z.string(),
  MYSQL_PORT: z.number(),
  MYSQL_USERNAME: z.string(),
  MYSQL_HOST: z.string(),
  MYSQL_ROOT_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  SWAGGER_USER: z.string().optional(),
  SWAGGER_PASSWORD: z.string().optional(),
});
