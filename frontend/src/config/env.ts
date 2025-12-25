// Vite exposes env variables through import.meta.env
// Environment variables must be prefixed with VITE_ to be exposed to client-side code
export const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT ||
  (import.meta.env.MODE === "production"
    ? "http://72.62.161.70:8000/api/v1"
    : "http://localhost:8000/api/v1");
export const ENVIRONMENT =
  import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || "development";
