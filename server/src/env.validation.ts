import Joi from 'joi';

export const validationSchema = Joi.object({
  // These have a usable default value
  PORT: Joi.number().default(8066),
  VIEWTUBE_SECURE: Joi.boolean().default(false),

  VIEWTUBE_ADMIN_USER: Joi.string().optional(),
  VIEWTUBE_LOCATION: Joi.string().optional(),
  VIEWTUBE_SUBSCRIPTION_INTERVAL_TIME: Joi.number().positive().integer().greater(0).default(60),

  VIEWTUBE_DATABASE_HOST: Joi.string().default('localhost'),
  VIEWTUBE_DATABASE_PORT: Joi.number().default(27017),
  VIEWTUBE_DATABASE_USER: Joi.string().optional(),
  VIEWTUBE_DATABASE_PASSWORD: Joi.string().optional(),

  VIEWTUBE_REDIS_HOST: Joi.string().default('localhost'),
  VIEWTUBE_REDIS_PORT: Joi.number().default(6379),
  VIEWTUBE_REDIS_PASSWORD: Joi.string().optional(),

  VIEWTUBE_DATA_DIRECTORY: Joi.string().default('/data'),
  VIEWTUBE_CLUSTERED: Joi.boolean().default(false),

  // These are not required for ViewTube to run
  VIEWTUBE_CORS_DOMAIN: Joi.string().optional(),
  VIEWTUBE_YOUTUBE_COOKIE: Joi.string().optional(),
  VIEWTUBE_PO_TOKEN: Joi.string().optional(),
  VIEWTUBE_VISITOR_DATA: Joi.string().optional()
});
