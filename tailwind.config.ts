import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/main/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-anton)', 'Impact', 'sans-serif'],
        marker: ['var(--font-marker)', 'cursive'],
        pixel: ['var(--font-pixel)', 'monospace'],
      },
      colors: {
        street: {
          lime: '#c4f82a',
          orange: '#ff5a1f',
          cyan: '#5ce1e6',
          yellow: '#ffd60a',
          pink: '#ff4fa3',
        },
      },
      gridTemplateRows: {
        app: 'min-content 1fr min-content',
      },
      boxShadow: {
        brutal: '5px 5px 0 0 rgb(0 0 0)',
        'brutal-lime': '5px 5px 0 0 #c4f82a',
        'brutal-sm': '3px 3px 0 0 rgb(0 0 0)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        glitch: {
          '0%, 100%': { clipPath: 'inset(50% 0 50% 0)', transform: 'translate(0)' },
          '62%': { clipPath: 'inset(10% 0 60% 0)', transform: 'translate(-6px, 2px)' },
          '66%': { clipPath: 'inset(70% 0 5% 0)', transform: 'translate(6px, -2px)' },
          '70%': { clipPath: 'inset(35% 0 45% 0)', transform: 'translate(-4px, 1px)' },
          '74%': { clipPath: 'inset(50% 0 50% 0)', transform: 'translate(0)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-5%, -10%)' },
          '40%': { transform: 'translate(-15%, 5%)' },
          '60%': { transform: 'translate(7%, -15%)' },
          '80%': { transform: 'translate(-10%, 10%)' },
        },
        'ken-burns': {
          from: { transform: 'scale(1.02)' },
          to: { transform: 'scale(1.12) translate(-1%, -1%)' },
        },
        'page-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.45) rotate(-8deg)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(-2deg) scale(1.05)' },
        },
        stamp: {
          '0%': { opacity: '0', transform: 'scale(2.4) rotate(-20deg)' },
          '70%': { opacity: '1', transform: 'scale(0.92) rotate(-8deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-8deg)' },
        },
        'dialog-in': {
          from: { opacity: '0', transform: 'scale(0.92) rotate(-2deg)' },
          to: { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 22%, 55%': { opacity: '0.35' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-reverse': 'marquee-reverse 28s linear infinite',
        'glitch-1': 'glitch 3.2s steps(1) infinite',
        'glitch-2': 'glitch 3.2s steps(1) 0.12s infinite reverse',
        grain: 'grain 0.9s steps(6) infinite',
        'ken-burns': 'ken-burns 18s ease-out infinite alternate',
        'page-in': 'page-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        bump: 'bump 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        wobble: 'wobble 3s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        stamp: 'stamp 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        flicker: 'flicker 3s linear infinite',
        'dialog-in': 'dialog-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
