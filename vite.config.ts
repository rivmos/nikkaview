import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist/types', // Save .d.ts files in a types directory
      insertTypesEntry: true, // Add an entry for types in the package.json
      exclude: ['src/main.tsx', 'src/App.tsx'], // Exclude specific files or patterns
    }),],
  build: {
    minify: true, // Enables minification
    lib: {
      entry: './src/index.ts', // Path to your index.ts
      name: 'nikkaview',
      formats: ['es', 'umd'],
      fileName: (format) => `nikkaview.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Ensure React is not bundled
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})