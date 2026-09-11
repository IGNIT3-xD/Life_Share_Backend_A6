import { createClient } from "redis";
import config from "../config";

export const redisClient = createClient({
	username: config.REDIS_USERNAME,
	password: config.REDIS_PASSWORD,
	socket: {
		host: config.REDIS_HOST,
		port: Number(config.REDIS_PORT),
	},
});

redisClient.on("error", (err) => {
	console.error("Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
	console.log("Redis client connected.");
});

redisClient.on("reconnecting", () => {
	console.log("Redis client reconnecting...");
});
