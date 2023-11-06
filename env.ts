/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
	HOST: Env.schema.string({ format: 'host' }),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	APP_NAME: Env.schema.string(),
	APP_URL: Env.schema.string(),
	DRIVE_DISK: Env.schema.enum(['local', 's3'] as const),
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),

	// SMTP MAIL
    MAIL_DRIVER: Env.schema.string(),
    SMTP_HOST: Env.schema.string.optional({ format: 'host' }),
    SMTP_PORT: Env.schema.number.optional(),
    SMTP_USERNAME: Env.schema.string.optional(),
    SMTP_PASSWORD: Env.schema.string.optional(),

	//AWS S3
	S3_KEY: Env.schema.string(),
    S3_SECRET: Env.schema.string(),
    S3_BUCKET: Env.schema.string(),
    S3_REGION: Env.schema.string(),
    S3_ENDPOINT: Env.schema.string.optional(),
	S3_BUCKET_FOLDER: Env.schema.string.optional(),

	// PAYSTACK
	PAYSTACK_SECRET_KEY: Env.schema.string(),
	PAYSTACK_PUBLIC_KEY: Env.schema.string(),
	PAYSTACK_BASE_URL: Env.schema.string(),
})
