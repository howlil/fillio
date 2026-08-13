import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Fillio',
    description: 'Local-first career form autofill',
    permissions: ['storage'],
  },
});
