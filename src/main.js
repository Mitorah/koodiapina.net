import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { startVersionCheck } from './utils/versionCheck.js'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')

// Start version checking in production
startVersionCheck()

// Service Worker registration - only in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .catch(() => {
        // Service worker registration failed
      });
  });
} else if ('serviceWorker' in navigator && import.meta.env.DEV) {
  // Unregister service worker in development to avoid conflicts
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}
