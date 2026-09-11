import config from "../config";
import AppError from "../utils/AppError";
import { redisClient } from "./redis";

let refreshInProgress = false;

export const getBkashIdToken = async () => {
	try {
		const idTokenKey = "bkash:id_token";
		const refreshTokenKey = "bkash:refresh_token";

		let bkashIdToken = await redisClient.get(idTokenKey);
		const bkashRefreshToken = await redisClient.get(refreshTokenKey);

		const TTLBkashIdToken = await redisClient.ttl(idTokenKey);
		const TTLBkashRefreshToken = await redisClient.ttl(refreshTokenKey);

		// If bkash id token's not found or time has less than 10 mints and bkash refresh token time has more than 10 mints
		if (
			(!bkashIdToken || TTLBkashIdToken < 600) &&
			bkashRefreshToken &&
			TTLBkashRefreshToken > 600
		) {
			if (refreshInProgress) {
				// Wait for ongoing refresh to complete
				await new Promise((resolve) => setTimeout(resolve, 500));
				bkashIdToken = await redisClient.get(idTokenKey);
				if (bkashIdToken) return bkashIdToken;
			}

			refreshInProgress = true;

			try {
				const refreshTokenResponse = await fetch(
					`${config.BKASH_BASE_URL}/tokenized/checkout/token/refresh`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
							username: config.BKASH_USERNAME,
							password: config.BKASH_PASSWORD,
						},
						body: JSON.stringify({
							app_key: config.BKASH_APP_KEY,
							app_secret: config.BKASH_APP_SECRET,
							refresh_token: bkashRefreshToken,
						}),
					},
				);

				if (!refreshTokenResponse.ok) {
					throw new AppError(400, "Bkash refresh token grant failed.");
				}

				const refreshTokenResult = await refreshTokenResponse.json();

				await redisClient.set(idTokenKey, refreshTokenResult.id_token, {
					expiration: {
						type: "EX",
						value: 60 * 60,
					},
				});

				bkashIdToken = refreshTokenResult.id_token;
				return bkashIdToken;
			} finally {
				refreshInProgress = false;
			}
		}

		if (TTLBkashIdToken > 600) {
			return bkashIdToken;
		}

		refreshInProgress = true;

		try {
			const response = await fetch(
				`${config.BKASH_BASE_URL}/tokenized/checkout/token/grant`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						username: config.BKASH_USERNAME,
						password: config.BKASH_PASSWORD,
					},
					body: JSON.stringify({
						app_key: config.BKASH_APP_KEY,
						app_secret: config.BKASH_APP_SECRET,
					}),
				},
			);

			if (!response.ok) {
				throw new AppError(400, "Bkash access token grant failed.");
			}

			const result = await response.json();

			await redisClient.set(idTokenKey, result.id_token, {
				expiration: {
					type: "EX",
					value: 60 * 60,
				},
			});

			await redisClient.set(refreshTokenKey, result.refresh_token, {
				expiration: {
					type: "EX",
					value: 60 * 60 * 24 * 28,
				},
			});

			bkashIdToken = result.id_token;
			return bkashIdToken;
		} finally {
			refreshInProgress = false;
		}
	} catch (error: any) {
		throw new AppError(400, error.message);
	}
};
