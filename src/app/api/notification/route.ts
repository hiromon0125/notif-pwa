import { sendNotification } from '../../actions/util';

export async function POST(req: Request) {
	const { name, message, title = 'Test Notification' } = await req.json();
	await sendNotification(name, message, title);
	return new Response('sent!', { status: 200 });
}
