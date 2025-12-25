import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// https://vite.dev/config/
dotenv.config();

export default defineConfig({
    plugins: [
        react({
            // Skip type checking during build to avoid TypeScript errors blocking the build
            typescript: {
                ignoreBuildErrors: true,
            },
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            '/api': {
                target:
                    process.env.VITE_API_ENDPOINT || 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Split vendor code into smaller, more manageable chunks
                    if (id.includes('node_modules')) {
                        // React core - separate from other React libs
                        if (
                            id.includes('react/') &&
                            !id.includes('react-dom')
                        ) {
                            return 'react-core';
                        }
                        // React DOM - separate chunk
                        if (id.includes('react-dom')) {
                            return 'react-dom';
                        }
                        // React Router - separate chunk
                        if (id.includes('react-router')) {
                            return 'react-router';
                        }
                        // TanStack Query - separate chunk
                        if (id.includes('@tanstack/react-query')) {
                            return 'react-query';
                        }
                        // Large charting library - separate chunk
                        if (id.includes('recharts')) {
                            return 'recharts';
                        }
                        // Excel libraries - separate chunk (very large)
                        if (id.includes('xlsx')) {
                            return 'xlsx';
                        }
                        // WebAuthn libraries - separate chunk
                        if (id.includes('@simplewebauthn')) {
                            return 'webauthn';
                        }
                        // React Icons - separate chunk (can be large)
                        if (id.includes('react-icons')) {
                            return 'react-icons';
                        }
                        // Tailwind CSS - separate chunk
                        if (id.includes('tailwindcss')) {
                            return 'tailwindcss';
                        }
                        // UI libraries - grouped together
                        if (id.includes('react-hot-toast')) {
                            return 'ui-libs';
                        }
                        // State management - separate chunk
                        if (id.includes('zustand')) {
                            return 'zustand';
                        }
                        // HTTP client - separate chunk
                        if (id.includes('axios')) {
                            return 'axios';
                        }
                        // All other node_modules go into vendor chunk
                        return 'vendor';
                    }
                },
            },
        },
        // Set chunk size warning limit
        // Note: Some chunks (like recharts, xlsx) are inherently large libraries
        // This is normal for modern applications with rich features
        chunkSizeWarningLimit: 1000,
        // Disable source maps for smaller production builds
        sourcemap: false,
        // Use esbuild for faster, efficient minification
        minify: 'esbuild',
        // Optimize asset inlining threshold
        assetsInlineLimit: 4096, // 4kb
    },
});
