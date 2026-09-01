/// <reference types="vite/client" />

interface Window {
  gtag?: (event: string, action: string, data?: Record<string, any>) => void;
}
