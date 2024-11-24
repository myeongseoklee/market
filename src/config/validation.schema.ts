import * as joi from 'joi';

export const validationSchema = joi.object({
  NODE_ENV: joi.string().valid('local', 'dev', 'production').required(),
  PORT: joi.number(),
  CORS_ORIGIN:
    process.env.NODE_ENV === 'production' ? joi.string().uri() : joi.string(),
  MYSQL_PORT: joi.number(),
  MYSQL_USERNAME: joi.string(),
  MYSQL_HOST: joi.string(),
  MYSQL_ROOT_PASSWORD: joi.string(),
  MYSQL_DATABASE: joi.string(),
  JWT_SECRET: joi.string(),
  JWT_EXPIRES_IN: joi.string(),
  JWT_REFRESH_SECRET: joi.string(),
  JWT_REFRESH_EXPIRES_IN: joi.string(),
  SWAGGER_USER: joi.string().optional(),
  SWAGGER_PASSWORD: joi.string().optional(),
});
