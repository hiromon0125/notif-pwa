import { sendNotification } from '../../actions/util';

export async function POST(req: Request) {
	const { name, message } = await req.json();
	await sendNotification(name, message);
	return new Response('sent!', { status: 200 });
}
