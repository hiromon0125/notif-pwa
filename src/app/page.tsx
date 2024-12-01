'use client';

import { useEffect, useState } from 'react';
import {
	sendNotification,
	subscribeUser,
	unsubscribeUser,
} from './actions/util';

function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	);
	const [message, setMessage] = useState('');
	const [name, setName] = useState('');
	useEffect(() => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			setIsSupported(true);
			registerServiceWorker();
		}
	}, []);

	async function registerServiceWorker() {
		const registration = await navigator.serviceWorker.register('/sw.js', {
			scope: '/',
			updateViaCache: 'none',
		});
		const sub = await registration.pushManager.getSubscription();
		setSubscription(sub);
	}

	async function subscribeToPush(name: string) {
		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
			),
		});
		setSubscription(sub);
		console.log(sub);
		await subscribeUser(name, JSON.stringify(sub));
	}

	async function unsubscribeFromPush(name: string) {
		await subscription?.unsubscribe();
		setSubscription(null);
		await unsubscribeUser(name);
	}

	async function sendTestNotification(name: string) {
		if (subscription) {
			await sendNotification(name, `${name}: ${message}`);
			setMessage('');
		}
	}

	if (!isSupported) {
		return <p>Push notifications are not supported in this browser.</p>;
	}

	return (
		<div>
			<h3>Push Notifications</h3>
			<div>
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					id="name"
					className=" text-black"
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			{subscription ? (
				<>
					<p>You are subscribed to push notifications.</p>
					<button
						onClick={() => unsubscribeFromPush(name)}
						className=" text-red-500 border border-red-500"
					>
						Unsubscribe
					</button>
					<div className=" flex flex-col gap-2 w-80 p-3 border border-white">
						<input
							type="text"
							className=" text-black"
							placeholder="Enter notification message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button
							onClick={() => sendTestNotification(name)}
							className=" border border-white"
						>
							Send Test
						</button>
					</div>
				</>
			) : (
				<>
					<p>You are not subscribed to push notifications.</p>
					<button onClick={() => subscribeToPush(name)}>
						Subscribe
					</button>
				</>
			)}
		</div>
	);
}

function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) &&
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				!(window as any).MSStream
		);

		setIsStandalone(
			window.matchMedia('(display-mode: standalone)').matches
		);
	}, []);

	if (isStandalone) {
		return null; // Don't show install button if already installed
	}

	return (
		<div>
			<h3>Install App</h3>
			<button>Add to Home Screen</button>
			{isIOS && (
				<p>
					To install this app on your iOS device, tap the share button
					<span role="img" aria-label="share icon">
						{' '}
						⎋{' '}
					</span>
					and then &quot;Add to Home Screen&quot;
					<span role="img" aria-label="plus icon">
						{' '}
						➕{' '}
					</span>
					.
				</p>
			)}
		</div>
	);
}

export default function Page() {
	return (
		<div>
			<PushNotificationManager />
			<InstallPrompt />
		</div>
	);
}
