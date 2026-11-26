import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E6007E',
          hover: '#C9006E',
        },
        semantic: {
          urgent: '#DC2626',
          alert: '#F97316',
          scheduled: '#2563EB',
          waiting: '#D97706',
          success: '#059669',
          unassigned: '#7C3AED',
          neutral: '#64748B',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [animate],
};
export default config;
