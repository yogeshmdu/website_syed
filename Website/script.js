/**
 * SYED BROILERS & MUTTON STALL - INTERACTIVE ENGINE
 * Anna Nagar, Madurai, Tamil Nadu
 * Maps: https://maps.app.goo.gl/wZo4ToCuJjLvqx236
 * Contacts: 7397471230 / 6383184080
 *
 * Core Content: Fresh Chicken, Fresh Mutton - Hygienically cut and packed
 */

let syedAppInitialized = false;

function initApp() {
  if (syedAppInitialized) return;
  syedAppInitialized = true;

  initThemeToggle();
  initLiveShopStatus();
  initRateDate();
  initHeaderScroll();
  initMobileDrawer();
  initCategoryFilters();
  initFaqAccordion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   0. LIGHT / DARK THEME TOGGLE SWITCH
   ========================================================================== */
function updateThemeUI(theme) {
  const isLight = theme === 'light';
  const themeText = document.getElementById('themeText');
  const drawerThemeText = document.getElementById('drawerThemeText');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const drawerThemeToggleBtn = document.getElementById('drawerThemeToggleBtn');

  if (themeText) {
    themeText.textContent = isLight ? 'Dark' : 'Light';
  }
  if (drawerThemeText) {
    drawerThemeText.textContent = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  }
  if (themeToggleBtn) {
    const label = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    themeToggleBtn.setAttribute('title', label);
    themeToggleBtn.setAttribute('aria-label', label);
  }
  if (drawerThemeToggleBtn) {
    const label = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    drawerThemeToggleBtn.setAttribute('title', label);
    drawerThemeToggleBtn.setAttribute('aria-label', label);
  }
}

window.toggleTheme = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

  html.setAttribute('data-theme', nextTheme);

  try {
    sessionStorage.setItem('syed_stall_theme', nextTheme);
  } catch (err) {}
  try {
    localStorage.setItem('syed_stall_theme', nextTheme);
  } catch (err) {}

  updateThemeUI(nextTheme);
  if (typeof showToast === 'function') {
    showToast(nextTheme === 'light' ? '☀️ Switched to Light Mode' : '🌙 Switched to Dark Mode');
  }
};

function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const drawerThemeToggleBtn = document.getElementById('drawerThemeToggleBtn');

  // Initial theme: always starts in light mode unless user toggled during this visit
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeUI(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.onclick = window.toggleTheme;
  }
  if (drawerThemeToggleBtn) {
    drawerThemeToggleBtn.onclick = window.toggleTheme;
  }
}

/* ==========================================================================
   1. LIVE SHOP STATUS (6:00 AM - 9:00 PM)
   ========================================================================== */
function initLiveShopStatus() {
  const statusBadge = document.getElementById('liveStatusBadge');
  const statusText = document.getElementById('liveStatusText');
  if (!statusBadge || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // Timings: Mon-Sat 6:00 AM (360m) - 9:00 PM (1260m)
  // Sunday 5:30 AM (330m) - 9:30 PM (1290m)
  let openTime = 6 * 60; // 6:00 AM
  let closeTime = 21 * 60; // 9:00 PM

  if (day === 0) {
    openTime = 5 * 60 + 30; // 5:30 AM
    closeTime = 21 * 60 + 30; // 9:30 PM
  }

  const isOpen = timeInMinutes >= openTime && timeInMinutes <= closeTime;

  if (isOpen) {
    statusText.textContent = 'OPEN NOW • Fresh Morning Stock Ready';
    statusBadge.classList.add('is-open');
  } else {
    statusText.textContent = 'OPENS 6:00 AM • Contact Stall: 7397471230';
    const dot = statusBadge.querySelector('.status-dot');
    if (dot) dot.style.backgroundColor = '#ffb703';
    statusBadge.style.color = '#ffb703';
    statusBadge.style.borderColor = 'rgba(255, 183, 3, 0.4)';
    statusBadge.style.background = 'rgba(255, 183, 3, 0.12)';
  }
}

/* ==========================================================================
   2. TODAY'S DATE FORMATTER FOR RATE BOARD
   ========================================================================== */
function initRateDate() {
  const dateEl = document.getElementById('rateDate');
  if (!dateEl) return;
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const todayStr = new Date().toLocaleDateString('en-IN', options);
  dateEl.textContent = `Live Rates for ${todayStr} • Daily Morning Fresh Stock`;

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   3. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   4. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-item');

  if (!mobileBtn || !drawer || !closeBtn) return;

  mobileBtn.addEventListener('click', () => {
    drawer.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });

  // Close when clicking backdrop
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !mobileBtn.contains(e.target)) {
      drawer.classList.remove('open');
    }
  });
}

/* ==========================================================================
   5. CATALOG CATEGORY FILTER
   ========================================================================== */
function initCategoryFilters() {
  const tabBtns = document.querySelectorAll('#cutFilters .tab-btn');
  const cards = document.querySelectorAll('#catalogGrid .catalog-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   9. UTILITIES: TOAST & COPY ADDRESS
   ========================================================================== */
function copyShopAddress() {
  const addressText = "Syed Broilers & Mutton Stall, Anna Nagar, Madurai, Tamil Nadu (Contact: 7397471230 / 6383184080) Maps: https://maps.app.goo.gl/wZo4ToCuJjLvqx236";

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(addressText)
      .then(() => showToast('Stall address copied to clipboard!'))
      .catch(() => fallbackCopy(addressText));
  } else {
    fallbackCopy(addressText);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Stall address copied to clipboard!');
  } catch (err) {
    showToast('Anna Nagar, Madurai (7397471230 / 6383184080)');
  }
  document.body.removeChild(textArea);
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
