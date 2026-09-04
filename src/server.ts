import app from "./app";
import config from "./app/config/index";
import { prisma } from "./app/lib/prisma";
import { redisClient } from "./app/lib/redis";

const PORT = config.PORT;

const main = async () => {
	try {
		await prisma.$connect();
		console.log("Connected to the database successfully.");

		await redisClient.connect();
		console.log("Connteted to the Redis sucessfully.");

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
};

main();
