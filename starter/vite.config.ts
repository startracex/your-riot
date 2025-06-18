import riot from '@your-riot/rollup-plugin'

export default {
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    include: ['**/*.test.ts', '**/*.spec.ts'],
  },
  plugins: [riot()],
}
