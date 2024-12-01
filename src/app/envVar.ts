import './envConfig';

export const REDIS_VAR: {
	port?: number;
	host?: string;
	password?: string;
} = {
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD,
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
};
