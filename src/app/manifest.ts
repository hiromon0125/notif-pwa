import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Next.js PWA',
		short_name: 'NextPWA',
		description: 'A Progressive Web App built with Next.js',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/hiro-icon-192.svg',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/hiro-icon-512.svg',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
