import type { MetaFunction } from '@remix-run/node';
import { defer, Link, useLoaderData } from '@remix-run/react';
import { bundleMDX } from 'mdx-bundler';
import { getFrontMatter, postContentsBySlug } from '~/utils/blog.server';
import { cn } from '~/utils/misc';

export const meta: MetaFunction = () => {
	return [{ title: 'Remix blog template by Lukas Alvarez' }];
};

export async function loader() {
	async function getPosts() {
		const posts = await Promise.all(
			Array.from(Object.entries(postContentsBySlug))
				.slice(0, 3)
				.map(async ([slug, content]) => {
					const { frontmatter } = await bundleMDX({ source: content });
					return { slug, metadata: getFrontMatter(frontmatter) };
				}),
		);

		return posts.sort(
			(a, b) => new Date(b.metadata.rawDate).getTime() - new Date(a.metadata.rawDate).getTime(),
		);
	}

	return defer({ posts: await getPosts() });
}

export default function Index() {
	const { posts } = useLoaderData<typeof loader>();

	return (
		<div>
			<h2 className="mb-8 text-center">Blog posts</h2>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{posts.map(post => (
					<Link to={`/blog/${post.slug}`} key={post.slug} prefetch="viewport" className="group">
						<div className="aspect-[3/4] relative mb-4">
							<img
								src={post.metadata.bannerUrl}
								alt={post.metadata.bannerCredit}
								className="w-full h-full object-cover rounded-lg mb-2 relative z-20"
								loading="lazy"
							/>
							<div
								className={cn(
									'w-[94%] h-[94%] absolute z-10 border-2 border-primary rounded-xl',
									'group-hover:scale-110 transition-transform',
									'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
								)}
							></div>
						</div>
						<p className="text-sm">{post.metadata.date}</p>
						<h4>{post.metadata.title}</h4>
					</Link>
				))}
			</div>
		</div>
	);
}
