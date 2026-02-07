// Main JavaScript for Landing Page
document.addEventListener("DOMContentLoaded", function () {
  console.log("VAULT Platform loaded");
  initLandingPage();
});

function initLandingPage() {
  // Initialize components
  initNavigation();
  initInvestmentCalculator();
  initPlanSelection();
  initFAQ();
  initAuthButtons();

  // Check user authentication
  checkAuthStatus();
  checkAboutUs();
}

// Navigation
function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      this.innerHTML = navMenu.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

// Investment Calculator
function initInvestmentCalculator() {
  const calcAmount = document.getElementById("calcAmount");
  const calcPeriod = document.getElementById("calcPeriod");
  const selectedPeriod = document.getElementById("selectedPeriod");

  if (!calcAmount || !calcPeriod) return;

  function calculateReturns() {
    const amount = parseFloat(calcAmount.value) || 1000;
    const weeks = parseInt(calcPeriod.value) || 4;
    const rate = 0.5; // 50% weekly

    // Calculate compound interest
    const total = amount * Math.pow(1 + rate, weeks);
    const returns = total - amount;

    // Update UI
    if (selectedPeriod) {
      selectedPeriod.textContent = `${weeks} Week${weeks > 1 ? "s" : ""}`;
    }

    document.getElementById("calcInvestment").textContent =
      formatCurrency(amount);
    document.getElementById("calcReturns").textContent =
      formatCurrency(returns);
    document.getElementById("calcTotal").textContent = formatCurrency(total);
  }

  // Initial calculation
  calculateReturns();

  // Update on input
  calcAmount.addEventListener("input", calculateReturns);
  calcPeriod.addEventListener("input", calculateReturns);
}

// Plan Selection
function initPlanSelection() {
  document.querySelectorAll(".plan-select").forEach((button) => {
    button.addEventListener("click", function () {
      const planName =
        this.closest(".plan-card").querySelector("h3").textContent;
      showNotification(`Please sign up to select the ${planName} plan`, "info");
    });
  });
}

// FAQ Accordion
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", function () {
      const item = this.closest(".faq-item");
      item.classList.toggle("active");

      // Toggle icon
      const icon = this.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
      }
    });
  });
}

// Authentication Buttons
function initAuthButtons() {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const startInvestingBtn = document.getElementById("startInvesting");
  const ctaSignupBtn = document.getElementById("ctaSignup");

  // Set up button actions
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", function () {
      window.location.href = "register.html";
    });
  }

  if (startInvestingBtn) {
    startInvestingBtn.addEventListener("click", function () {
      window.location.href = "register.html";
    });
  }

  if (ctaSignupBtn) {
    ctaSignupBtn.addEventListener("click", function () {
      window.location.href = "register.html";
    });
  }
}
function checkAboutUs() {
  const aboutUsBtn = document.getElementById("aboutUsBtn");

  aboutUsBtn.addEventListener("click", function () {
    window.location.href = "aboutUs.html";
  });
}

// Check Authentication Status
async function checkAuthStatus() {
  try {
    // Initialize Supabase
    const SUPABASE_URL = "https://grfrcnhmnvasiotejiok.supabase.co";
    const SUPABASE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZnJjbmhtbnZhc2lvdGVqaW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzU5OTQsImV4cCI6MjA4MTQxMTk5NH0.oPvC2Ax6fUxnC_6apCdOCAiEMURotfljco6r3_L66_k";
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      updateAuthButtons(true, user);
    } else {
      updateAuthButtons(false);
    }
  } catch (error) {
    console.error("Auth check error:", error);
    updateAuthButtons(false);
  }
}

// Update Authentication Buttons
function updateAuthButtons(isLoggedIn, user = null) {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  if (isLoggedIn) {
    // User is logged in
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      loginBtn.onclick = function () {
        logoutUser();
      };
    }

    if (signupBtn) {
      signupBtn.innerHTML = '<i class="fas fa-dashboard"></i> Dashboard';
      signupBtn.onclick = function () {
        window.location.href = "dashboard.html";
      };
    }
  } else {
    // User is not logged in
    if (loginBtn) {
      loginBtn.innerHTML = "Sign In";
      loginBtn.onclick = function () {
        window.location.href = "login.html";
      };
    }

    if (signupBtn) {
      signupBtn.innerHTML = "Sign up";
      signupBtn.onclick = function () {
        window.location.href = "register.html";
      };
    }
  }
}

// Logout User
async function logoutUser() {
  try {
    // Initialize Supabase
    const SUPABASE_URL = "https://grfrcnhmnvasiotejiok.supabase.co";
    const SUPABASE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZnJjbmhtbnZhc2lvdGVqaW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzU5OTQsImV4cCI6MjA4MTQxMTk5NH0.oPvC2Ax6fUxnC_6apCdOCAiEMURotfljco6r3_L66_k";
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Sign out
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    showNotification("Logged out successfully", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.error("Logout error:", error);
    showNotification("Logout failed", "error");
  }
}

// Add this to your existing main.js file

// ========================================
// PWA INSTALLATION HANDLER
// ========================================

let deferredPrompt;
const installButton = document.getElementById("installButton");

// Create install button if it doesn't exist
function createInstallButton() {
  const installBtn = document.createElement("button");
  installBtn.id = "installButton";
  installBtn.className = "pwa-install-btn";
  installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
  installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #4361ee, #3a0ca3);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 5px 20px rgba(67, 97, 238, 0.3);
    z-index: 9999;
    display: none;
  `;

  installBtn.addEventListener("click", installPWA);
  document.body.appendChild(installBtn);
  return installBtn;
}

// Listen for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("📱 PWA: Install prompt available");

  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();

  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Create or show install button
  let installBtn = document.getElementById("installButton");
  if (!installBtn) {
    installBtn = createInstallButton();
  }

  installBtn.style.display = "block";

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (installBtn && installBtn.style.display === "block") {
      installBtn.style.display = "none";
    }
  }, 10000);
});

// Install PWA function
async function installPWA() {
  if (!deferredPrompt) {
    console.log("PWA already installed");
    return;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  console.log(`User response to the install prompt: ${outcome}`);

  // Hide the install button
  const installBtn = document.getElementById("installButton");
  if (installBtn) {
    installBtn.style.display = "none";
  }

  // Clear the deferredPrompt variable
  deferredPrompt = null;
}

// Check if app is installed
window.addEventListener("appinstalled", (evt) => {
  console.log("🎉 PWA installed successfully!");

  // Show welcome message
  showNotification("ZEVRA app installed successfully!", "success");

  // Hide install button
  const installBtn = document.getElementById("installButton");
  if (installBtn) {
    installBtn.style.display = "none";
  }

  // Track installation in database
  trackInstallation();
});

// Check if running in standalone mode
function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// Add standalone mode features
if (isRunningStandalone()) {
  console.log("📱 Running in standalone app mode");

  // Add app-specific features
  document.documentElement.classList.add("standalone-mode");

  // Customize UI for app mode
  if (document.querySelector(".navbar")) {
    document.querySelector(".navbar").style.paddingTop = "20px";
  }
}

// Track PWA installation
async function trackInstallation() {
  try {
    const supabase = window.supabase.createClient(
      "https://grfrcnhmnvasiotejiok.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZnJjbmhtbnZhc2lvdGVqaW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzU5OTQsImV4cCI6MjA4MTQxMTk5NH0.oPvC2Ax6fUxnC_6apCdOCAiEMURotfljco6r3_L66_k",
    );

    const { error } = await supabase.from("app_installations").insert([
      {
        user_id: localStorage.getItem("userId") || "anonymous",
        platform: navigator.platform,
        user_agent: navigator.userAgent,
        install_date: new Date().toISOString(),
        install_source: "pwa",
        version: "1.0.0",
      },
    ]);

    if (error) console.log("Install tracking note:", error.message);
  } catch (error) {
    console.log("Install tracking failed:", error.message);
  }
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          console.log("🔄 New service worker found:", newWorker.state);

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("📦 New content available!");
              showAppUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}

// Show update notification
function showAppUpdateNotification() {
  if (!isRunningStandalone()) return;

  const notification = document.createElement("div");
  notification.className = "app-update-notification";
  notification.innerHTML = `
    <div class="update-content">
      <i class="fas fa-sync-alt"></i>
      <span>New update available!</span>
      <button id="updateApp" class="update-btn">Update Now</button>
      <button id="dismissUpdate" class="dismiss-btn">Later</button>
    </div>
  `;

  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 15px;
  `;

  document.body.appendChild(notification);

  document.getElementById("updateApp").addEventListener("click", () => {
    window.location.reload();
  });

  document.getElementById("dismissUpdate").addEventListener("click", () => {
    notification.remove();
  });

  // Auto-dismiss after 30 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 30000);
}

// Add PWA capabilities check
function checkPWASupport() {
  const supports = {
    serviceWorker: "serviceWorker" in navigator,
    installPrompt: "beforeinstallprompt" in window,
    standalone: window.matchMedia("(display-mode: standalone)").matches,
    notifications: "Notification" in window,
    pushManager: "PushManager" in window,
    backgroundSync: "SyncManager" in window,
  };

  console.log("📱 PWA Capabilities:", supports);
  return supports;
}

// Request notification permission
async function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);

      if (permission === "granted") {
        console.log("✅ Notification permission granted");
        setupPushNotifications();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }
}

// Setup push notifications
async function setupPushNotifications() {
  if ("PushManager" in window && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("YOUR_VAPID_PUBLIC_KEY"), // Add your VAPID key here
      });

      console.log("Push subscription:", subscription);

      // Send subscription to server
      await savePushSubscription(subscription);
    } catch (error) {
      console.error("Push subscription failed:", error);
    }
  }
}

// Helper function for VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Save push subscription to Supabase
async function savePushSubscription(subscription) {
  try {
    const supabase = window.supabase.createClient(
      "https://grfrcnhmnvasiotejiok.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZnJjbmhtbnZhc2lvdGVqaW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzU5OTQsImV4cCI6MjA4MTQxMTk5NH0.oPvC2Ax6fUxnC_6apCdOCAiEMURotfljco6r3_L66_k",
    );

    const { error } = await supabase.from("push_subscriptions").insert([
      {
        user_id: localStorage.getItem("userId") || "anonymous",
        subscription: subscription,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) console.log("Push subscription save note:", error.message);
  } catch (error) {
    console.log("Push subscription save failed:", error.message);
  }
}

// Initialize PWA features
document.addEventListener("DOMContentLoaded", function () {
  // Check PWA support
  checkPWASupport();

  // Request notification permission on user interaction
  document.addEventListener(
    "click",
    function requestPerms() {
      requestNotificationPermission();
      document.removeEventListener("click", requestPerms);
    },
    { once: true },
  );

  // Check if in app mode and adjust UI
  if (isRunningStandalone()) {
    // Add standalone UI enhancements
    const standaloneStyles = document.createElement("style");
    standaloneStyles.textContent = `
      .standalone-mode .navbar {
        padding-top: env(safe-area-inset-top);
      }
      
      .standalone-mode body {
        padding-bottom: env(safe-area-inset-bottom);
      }
      
      /* Add app-like navigation */
      .app-nav {
        display: flex;
        justify-content: space-around;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        padding: 10px 0;
        border-top: 1px solid #eaeaea;
        z-index: 1000;
      }
    `;
    document.head.appendChild(standaloneStyles);
  }
});

// Utility Functions
function formatCurrency(amount) {
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  document.querySelectorAll(".notification-toast").forEach((el) => el.remove());

  const toast = document.createElement("div");
  toast.className = `notification-toast ${type}`;

  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    info: "info-circle",
  };

  toast.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icons[type] || "info-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  document.body.appendChild(toast);

  // Close button
  toast.querySelector(".notification-close").addEventListener("click", () => {
    toast.remove();
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 5000);
}

// Add notification styles
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .notification-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        border-left: 4px solid #4361ee;
        max-width: 400px;
    }
    
    .notification-toast.success {
        border-left-color: #4cc9f0;
    }
    
    .notification-toast.error {
        border-left-color: #f72585;
    }
    
    .notification-toast.info {
        border-left-color: #4361ee;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-toast.success i {
        color: #4cc9f0;
    }
    
    .notification-toast.error i {
        color: #f72585;
    }
    
    .notification-toast.info i {
        color: #4361ee;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #6b7280;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize animations
function initAnimations() {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    { threshold: 0.1 },
  );

  // Observe elements for animation
  document
    .querySelectorAll(".feature-card, .plan-card, .testimonial-card")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Add animation styles
const animationStyles = document.createElement("style");
animationStyles.textContent = `
    .feature-card,
    .plan-card,
    .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .feature-card.animated,
    .plan-card.animated,
    .testimonial-card.animated {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyles);

// Initialize animations on load
window.addEventListener("load", initAnimations);
