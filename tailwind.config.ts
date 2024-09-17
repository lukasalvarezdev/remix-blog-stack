import type { Config } from 'tailwindcss';

export default {
	content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
	future: { hoverOnlyWhenSupported: true },
	theme: {
		extend: {
			fontFamily: {
				sans: ['"DM sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
} satisfies Config;
