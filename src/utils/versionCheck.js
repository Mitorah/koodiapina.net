// Version check utility to force PWA updates when backend version changes

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const VERSION_STORAGE_KEY = 'app_version';

let checkInterval = null;
let notificationShown = false;

/**
 * Show update notification to user
 */
function showUpdateNotification() {
  if (notificationShown) return;
  notificationShown = true;
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #409eff;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 90%;
    text-align: center;
  `;
  notification.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: 600;">🎉 New version available!</div>
    <div style="margin-bottom: 12px; opacity: 0.95;">The app will update in <span id="countdown">5</span> seconds...</div>
    <button id="update-now" style="
      background: white;
      color: #409eff;
      border: none;
      padding: 6px 16px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
    ">Update Now</button>
  `;
  
  document.body.appendChild(notification);
  
  let countdown = 5;
  const countdownEl = document.getElementById('countdown');
  const updateBtn = document.getElementById('update-now');
  
  const performUpdate = async () => {
    // Clear the cache and reload
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Force hard reload
    window.location.reload(true);
  };
  
  updateBtn.addEventListener('click', performUpdate);
  
  const timer = setInterval(() => {
    countdown--;
    if (countdownEl) {
      countdownEl.textContent = countdown;
    }
    if (countdown <= 0) {
      clearInterval(timer);
      performUpdate();
    }
  }, 1000);
}

/**
 * Check if the API version has changed and force reload if needed
 */
async function checkVersion() {
  try {
    const apiUrl = import.meta.env.PROD 
      ? 'https://ruoka.koodiapina.net/api/version'
      : 'http://localhost:8787/version';
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      return;
    }
    
    const data = await response.json();
    const currentVersion = data.version;
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
    
    // If we have a stored version and it doesn't match, force reload
    if (storedVersion && storedVersion !== currentVersion) {
      // Store new version before showing notification
      localStorage.setItem(VERSION_STORAGE_KEY, currentVersion);
      
      // Show notification with countdown
      showUpdateNotification();
    } else if (!storedVersion) {
      // First time - just store the version
      localStorage.setItem(VERSION_STORAGE_KEY, currentVersion);
    }
  } catch (error) {
    // Version check error
  }
}

/**
 * Start periodic version checking
 */
export function startVersionCheck() {
  // Only in production
  if (!import.meta.env.PROD) {
    return;
  }
  
  // Check immediately on start
  checkVersion();
  
  // Check periodically
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  checkInterval = setInterval(checkVersion, VERSION_CHECK_INTERVAL);
  
  // Check when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkVersion();
    }
  });
}

/**
 * Stop version checking (cleanup)
 */
export function stopVersionCheck() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}
