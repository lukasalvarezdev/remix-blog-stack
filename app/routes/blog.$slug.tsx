import * as React from 'react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getMDXComponent } from 'mdx-bundler/client';
import { getPostBySlug } from '~/utils/blog.server';
import { blogPageMeta } from '~/utils/blog.meta';
import { cn } from '~/utils/misc';

export const meta = blogPageMeta;

export async function loader({ params }: LoaderFunctionArgs) {
	const { slug } = params;
	if (!slug) throw new Error('No slug provided');
	return await getPostBySlug(slug);
}

export default function BlogPost() {
	const { code, slug, metadata } = useLoaderData<typeof loader>();

	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<div key={slug} className="text-lg py-6">
			<div className="max-w-2xl mx-auto">
				<Link
					to="/"
					className="flex gap-2 mb-8 text-base text-black dark:text-white items-center group max-w-max"
				>
					<ArrowBack />
					Back to blog
				</Link>
				<h1 className="mb-2 text-black dark:text-white text-4xl font-medium">
					{metadata.title}
				</h1>
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

function ArrowBack(props: React.ComponentProps<'svg'>) {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			className={cn('transform rotate-90 group-hover:-translate-x-1 transition-all')}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15.101 5.5V23.1094L9.40108 17.4095L8.14807 18.6619L15.9862 26.5L23.852 18.6342L22.5996 17.3817L16.8725 23.1094V5.5H15.101Z"
				fill="currentColor"
			></path>
		</svg>
	);
}
