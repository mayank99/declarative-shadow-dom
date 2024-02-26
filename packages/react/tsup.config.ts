import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['index.tsx'],
	outDir: '.',
	format: ['esm'],
	dts: {
		compilerOptions: {
			jsx: 'react',
		}
	}
})
