import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  format: {
    esm: {
      target: ['es2015'],
    },
    cjs: {
      target: ['node20'],
    },
  },
})
