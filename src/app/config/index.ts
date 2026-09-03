import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	PORT: process.env.PORT,
	DATABASE_URL: process.env.DATABASE_URL,
};
