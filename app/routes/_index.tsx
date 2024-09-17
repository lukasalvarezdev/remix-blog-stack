import type { MetaFunction } from '@remix-run/node';
import { defer, Link, useLoaderData } from '@remix-run/react';
import { getAllPosts } from '~/utils/blog.server';
import { cn } from '~/utils/misc';

export const meta: MetaFunction = () => {
	return [{ title: 'Remix Blog Stack by Lukas Alvarez' }];
};

export async function loader() {
	return defer({ posts: await getAllPosts() });
}

export default function Index() {
	const { posts } = useLoaderData<typeof loader>();

	return (
		<div className="mx-auto max-w-4xl py-8 text-lg">
			<h1 className="mb-4 text-center text-black font-bold text-5xl">Remix Blog Stack</h1>

			<p className="mb-8 text-center max-w-2xl mx-auto">
				Add your blog posts to the <code>app/content</code> directory. Each post should be a{' '}
				<code>.mdx</code> file. Check the README for more information.
			</p>

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
						<p className="text-sm text-gray-600">{post.metadata.date}</p>
						<h4 className="font-medium">{post.metadata.title}</h4>
					</Link>
				))}
			</div>

			<p className="mt-12">
				Made by{' '}
				<a
					className="underline"
					href="https://lukasalvarez.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					Lukas Alvarez
				</a>{' '}
				&copy; {new Date().getFullYear()}
			</p>
		</div>
	);
}
