import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { startVersionCheck } from './utils/versionCheck.js'

const app = createApp(App)

app.use(ElementPlus)

// Create a custom message function that makes notifications clickable to dismiss
app.config.globalProperties.$message = function(options) {
  const messageInstance = ElMessage(options);
  
  // Wait for the DOM to be ready, then add click handler
  setTimeout(() => {
    // Get all message elements and find the newest one (last in the list)
    const messageElements = document.querySelectorAll('.el-message');
    const messageEl = messageElements[messageElements.length - 1];
    
    if (messageEl && !messageEl.dataset.clickHandlerAdded) {
      messageEl.dataset.clickHandlerAdded = 'true';
      messageEl.style.cursor = 'pointer';
      messageEl.addEventListener('click', () => {
        messageInstance.close();
      });
    }
  }, 10);
  
  return messageInstance;
};

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
