const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  timeout: 10000,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
})
