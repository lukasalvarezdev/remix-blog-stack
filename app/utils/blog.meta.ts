import { MetaFunction, TypedResponse } from '@remix-run/node';
import { RootLoaderType } from '~/root';
import { PostType } from './blog.server';

type ExtraMeta = Array<{ [key: string]: string }>;
type MetaLoader = () => Promise<TypedResponse<PostType>>;

export const blogPageMeta: MetaFunction<MetaLoader, { root: RootLoaderType }> = ({
	data,
	matches,
}) => {
	const requestInfo = getRequestInfo();

	if (data) {
		const extraMetaInfo = data.metadata.meta ?? {};
		const extraMeta: ExtraMeta = Object.entries(extraMetaInfo).reduce(
			(acc: ExtraMeta, [key, val]) => [...acc, { [key]: String(val) }],
			[],
		);

		const title = data.metadata.title;
		const url = getUrl(requestInfo);

		return [
			...getSocialMetas({
				url,
				title,
				description: data.metadata.description,
				image: data.metadata.bannerUrl,
			}),
			...extraMeta,
		].filter(Boolean);
	} else {
		return [{ title: 'Not found' }, { description: 'You landed on the wrong place buddy' }];
	}

	function getRequestInfo() {
		return (matches.find(m => m.id === 'root')?.data as RootLoaderType)?.requestInfo;
	}
};

function getOrigin(requestInfo?: { origin?: string; path: string }) {
	return requestInfo?.origin ?? 'https://lukasalvarez.com';
}
function removeTrailingSlash(s: string) {
	return s.endsWith('/') ? s.slice(0, -1) : s;
}
function getUrl(requestInfo?: { origin: string; path: string }) {
	return removeTrailingSlash(`${getOrigin(requestInfo)}${requestInfo?.path ?? ''}`);
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
