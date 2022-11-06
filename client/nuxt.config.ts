import { getApiUrl } from '../shared/index';
import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: getApiUrl(),
      vapidKey: process.env.VIEWTUBE_PUBLIC_VAPID
    }
  },

  alias: {
    'viewtube/*': '../*'
  },

  css: [
    '@/assets/fonts/expletus.css',
    '@/assets/fonts/notosans.css',
    'tippy.js/dist/tippy.css',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
           @use "sass:math";
           @import "modern-js-ripple/dist/index.css";
           @import "@/assets/styles/global/variables.scss";
          `
        }
      }
    }
  },

  modules: ['@pinia/nuxt']
});
