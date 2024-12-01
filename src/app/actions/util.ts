'use server';
import webpush from 'web-push';
import { z } from 'zod';
import '../envConfig';
import { createRedisInstance } from '../redis';

webpush.setVapidDetails(
	'mailto:' + process.env.NEXT_PUBLIC_EMAIL!,
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

const redisClient = createRedisInstance();

// let subscription: PushSubscription | null = null;

export async function subscribeUser(name: string, sub: string) {
	// In a production environment, you would want to store the subscription in a database
	// For example: await db.subscriptions.create({ data: sub })
	await redisClient.set(name, JSON.stringify(sub));
	return { success: true };
}

export async function unsubscribeUser(name: string) {
	await redisClient.del(name);
	return { success: true };
}

const websubscriptionSchema = z.object({
	endpoint: z.string(),
	keys: z.object({
		p256dh: z.string(),
		auth: z.string(),
	}),
});

export async function sendNotification(
	name: string,
	message: string,
	title: string = 'Test Notification'
) {
	const subscription = websubscriptionSchema.parse(
		JSON.parse(JSON.parse((await redisClient.get(name)) || 'null'))
	);

	if (!subscription) {
		return { success: false, error: 'Subscription not found' };
	}
	try {
		await webpush.sendNotification(
			subscription,
			JSON.stringify({
				title,
				body: message,
				icon: '/hiro-icon-512.svg',
			})
		);
		return { success: true };
	} catch (error) {
		console.error('Error sending push notification:', error);
		return { success: false, error: 'Failed to send notification' };
	}
}
