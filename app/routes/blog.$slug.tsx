import * as React from 'react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, MetaFunction, useLoaderData } from '@remix-run/react';
import { getMDXComponent } from 'mdx-bundler/client';
import { bundleMDX } from 'mdx-bundler';
import { rehypePrettyCode } from 'rehype-pretty-code';
import { getSocialMetas } from '~/utils/misc';
import { RootLoaderType } from '~/root';
import { getFrontMatter, getMdxPage } from '~/utils/blog.server';

export async function loader({ params }: LoaderFunctionArgs) {
	const { slug } = params;

	if (!slug) throw new Error('No slug provided');

	const fileContent = await getMdxPage(slug);

	const { code, frontmatter } = await bundleMDX({
		source: fileContent,
		mdxOptions(options) {
			options.remarkPlugins = [...(options.remarkPlugins ?? [])];
			options.rehypePlugins = [
				...(options.rehypePlugins ?? []),
				[rehypePrettyCode, { theme: { dark: 'github-dark-dimmed', light: 'github-light' } }],
			];

			return options;
		},
	});

	return { code, slug, metadata: getFrontMatter(frontmatter) };
}

export default function BlogPost() {
	const { code, slug, metadata } = useLoaderData<typeof loader>();

	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<div key={slug}>
			<div className="max-w-2xl mx-auto">
				<Link to="/">Back to blog</Link>
				<h1 className="mb-2 text-black dark:text-white">{metadata.title}</h1>
				<p className="text-sm mb-8">{metadata.date}</p>
			</div>

			<div className="max-w-4xl mx-auto">
				<img
					src={metadata.bannerUrl}
					alt={metadata.bannerCredit}
					className="w-full object-cover rounded-lg mb-8"
					loading="lazy"
				/>
			</div>

			<div className="mdx max-w-2xl mx-auto">
				<Component />
			</div>
		</div>
	);
}

type ExtraMeta = Array<{ [key: string]: string }>;
type MetaLoader = typeof loader;

export const meta: MetaFunction<MetaLoader, { root: RootLoaderType }> = ({ data, matches }) => {
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
