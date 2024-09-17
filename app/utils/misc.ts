import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A handy utility that makes constructing class names easier.
 * It also merges tailwind classes.
 */
export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

const images = {
	garden:
		'https://res.cloudinary.com/dmfhqqv3t/image/upload/v1726410443/markus-spiske-bk11wZwb9F4-unsplash_2_cq42fa.jpg',
};

/**
 * Inspired by https://kentcdodds.com
 */
export function getSocialMetas({
	url,
	title = "Going beyond software: Make something you're truly proud of.",
	description = 'Make the world better with software',
	image = images.garden,
	keywords = '',
}: {
	image?: string;
	url: string;
	title?: string;
	description?: string;
	keywords?: string;
}) {
	return [
		{ title },
		{ name: 'description', content: description },
		{ name: 'keywords', content: keywords },
		{ name: 'image', content: image },
		{ name: 'og:url', content: url },
		{ name: 'og:title', content: title },
		{ name: 'og:description', content: description },
		{ name: 'og:image', content: image },
		{
			name: 'twitter:card',
			content: image ? 'summary_large_image' : 'summary',
		},
		{ name: 'twitter:creator', content: '@lukasalvarezdev' },
		{ name: 'twitter:site', content: '@lukasalvarezdev' },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: image },
		{ name: 'twitter:image:alt', content: title },
	];
}

/**
 * @returns domain URL (without a ending slash, e.g. `https://lukasalvarez.com`)
 */
export function getDomainUrl(request: Request) {
	const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
	if (!host) {
		throw new Error('Could not determine domain URL.');
	}
	const protocol = host.includes('localhost') ? 'http' : 'https';
	return `${protocol}://${host}`;
}
