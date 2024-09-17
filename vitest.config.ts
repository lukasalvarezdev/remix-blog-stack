/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode }: UserConfig) => {
	// Load app-level env vars to node-level env vars.
	Object.assign(process.env, loadEnv(mode ?? 'test', process.cwd(), ''));

	return defineConfig({
		plugins: [react(), tsconfigPaths()],
		test: { watch: false, globals: true },
	});
};
