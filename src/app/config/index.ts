import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	PORT: process.env.PORT,
	DATABASE_URL: process.env.DATABASE_URL,
	FRONTEND_URL: process.env.FRONTEND_URL,
	NODE_ENV: process.env.NODE_ENV,
	JWT_ACCESS: process.env.JWT_ACCESS as string,
	JWT_REFRESH: process.env.JWT_REFRESH as string,
	JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
	JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
	REDIS_USERNAME: process.env.REDIS_USERNAME,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_EMAIL_SENDER: process.env.SMTP_EMAIL_SENDER,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};
