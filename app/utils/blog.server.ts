import { bundleMDX } from 'mdx-bundler';
import { formatDate } from './misc';
import { rehypePrettyCode } from 'rehype-pretty-code';

export async function getAllPosts() {
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

export async function getPostBySlug(slug: string) {
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
export type PostType = Awaited<ReturnType<typeof getPostBySlug>>;

const postContentsBySlug = Object.fromEntries(
	Object.entries(
		import.meta.glob('../content/*.mdx', {
			query: '?raw',
			import: 'default',
			eager: true,
		}),
	).map(([filePath, contents]) => {
		if (typeof contents !== 'string') {
			throw new Error(`Expected ${filePath} to be a string, but got ${typeof contents}`);
		}

		return [filePath.replace('../content/', '').replace(/\.mdx$/, ''), contents];
	}),
);

export async function getMdxPage(slug: string) {
	const post = postContentsBySlug[slug];
	if (!post) throw new Error('Post not found');
	return post;
}

export type FrontmatterType = {
	title: string;
	date: string;
	description: string;
	bannerCredit: string;
	bannerUrl: string;
	rawDate: string;
	meta: { keywords: string[] };
};

export function getFrontMatter(frontmatter: Record<string, unknown>): FrontmatterType {
	const matter = frontmatter as FrontmatterType;
	return { ...matter, date: formatDate(matter.date), rawDate: matter.date };
}
