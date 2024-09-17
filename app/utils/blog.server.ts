import { formatDate } from './misc';

export const postContentsBySlug = Object.fromEntries(
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
