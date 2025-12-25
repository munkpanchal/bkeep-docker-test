// Vite exposes env variables through import.meta.env
// Environment variables must be prefixed with VITE_ to be exposed to client-side code
export const API_ENDPOINT =
    import.meta.env.VITE_API_ENDPOINT || 'http://0.0.0.0:8000/api';
export const ENVIRONMENT =
    import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development';
