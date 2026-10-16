/**
 * SYED BROILERS & MUTTON STALL - INTERACTIVE ENGINE
 * Anna Nagar, Madurai, Tamil Nadu
 * Maps: https://maps.app.goo.gl/wZo4ToCuJjLvqx236
 * Contacts: 7397471230 / 6383184080
 *
 * Core Content: Fresh Chicken, Fresh Mutton - Hygienically cut and packed
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLiveShopStatus();
  initRateDate();
  initHeaderScroll();
  initMobileDrawer();
  initCategoryFilters();
  initEstimator();
  initFaqAccordion();
});

/* ==========================================================================
   0. LIGHT / DARK THEME TOGGLE SWITCH
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const drawerThemeToggleBtn = document.getElementById('drawerThemeToggleBtn');
  const themeText = document.getElementById('themeText');
  const drawerThemeText = document.getElementById('drawerThemeText');

  function updateThemeUI(theme) {
    const isLight = theme === 'light';
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
  }

  function toggleTheme(e) {
    if (e) e.preventDefault();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('syed_stall_theme', nextTheme);
    } catch (err) {}
    updateThemeUI(nextTheme);
    if (typeof showToast === 'function') {
      showToast(nextTheme === 'light' ? '☀️ Switched to Light Mode' : '🌙 Switched to Dark Mode');
    }
  }

  // Sync button labels on load
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeUI(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (drawerThemeToggleBtn) {
    drawerThemeToggleBtn.addEventListener('click', toggleTheme);
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
    statusText.textContent = 'OPENS 6:00 AM • Accepting WhatsApp Orders';
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
   6. CUSTOM WEIGHT & PRICE ESTIMATOR WITH REAL-TIME WHATSAPP BUILDER
   ========================================================================== */
let estimatorState = {
  selectedMeat: 'Fresh Farm Broiler Chicken',
  rate: 240,
  isFixedPrice: false,
  weight: 1.0,
  prepStyle: 'Medium Curry Cut',
  orderMode: 'Store Pickup at Anna Nagar Stall',
  customerName: ''
};

function initEstimator() {
  // Radio buttons for meat type
  const meatRadios = document.querySelectorAll('input[name="meatSelection"]');
  meatRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.cut-radio-label').forEach(lbl => lbl.classList.remove('active'));
      radio.closest('.cut-radio-label').classList.add('active');

      estimatorState.selectedMeat = radio.value;
      estimatorState.rate = parseFloat(radio.getAttribute('data-rate'));
      estimatorState.isFixedPrice = radio.getAttribute('data-is-fixed') === 'true';

      const weightGroup = document.getElementById('weightGroup');
      if (weightGroup) {
        weightGroup.style.opacity = estimatorState.isFixedPrice ? '0.6' : '1';
      }

      updateEstimatorSummary();
    });
  });

  // Weight Slider
  const slider = document.getElementById('weightSlider');
  const weightDisplay = document.getElementById('weightDisplayValue');
  const weightPills = document.querySelectorAll('.weight-pill');

  if (slider) {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      estimatorState.weight = val;
      if (weightDisplay) weightDisplay.textContent = `${val.toFixed(2)} kg`;

      weightPills.forEach(pill => {
        if (parseFloat(pill.getAttribute('data-weight')) === val) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      updateEstimatorSummary();
    });
  }

  // Weight Quick Pills
  weightPills.forEach(pill => {
    pill.addEventListener('click', () => {
      weightPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const val = parseFloat(pill.getAttribute('data-weight'));
      estimatorState.weight = val;
      if (slider) slider.value = val;
      if (weightDisplay) weightDisplay.textContent = `${val.toFixed(2)} kg`;

      updateEstimatorSummary();
    });
  });

  // Prep Style Chips
  const prepRadios = document.querySelectorAll('input[name="prepStyle"]');
  prepRadios.forEach(r => {
    r.addEventListener('change', () => {
      estimatorState.prepStyle = r.value;
      updateEstimatorSummary();
    });
  });

  // Order Mode (Pickup vs Delivery)
  const modeRadios = document.querySelectorAll('input[name="orderMode"]');
  modeRadios.forEach(m => {
    m.addEventListener('change', () => {
      document.querySelectorAll('.mode-label').forEach(lbl => lbl.classList.remove('active'));
      m.closest('.mode-label').classList.add('active');
      estimatorState.orderMode = m.value;
      updateEstimatorSummary();
    });
  });

  // Customer Name Input
  const nameInput = document.getElementById('customerNameInput');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      estimatorState.customerName = e.target.value.trim();
      updateEstimatorSummary();
    });
  }

  updateEstimatorSummary();
}

function updateEstimatorSummary() {
  const sumCut = document.getElementById('sumCut');
  const sumWeight = document.getElementById('sumWeight');
  const sumPrep = document.getElementById('sumPrep');
  const sumMode = document.getElementById('sumMode');
  const sumTotal = document.getElementById('sumTotal');
  const waTrigger = document.getElementById('whatsappOrderTrigger');

  let totalAmount = 0;
  let weightText = `${estimatorState.weight.toFixed(2)} kg`;

  if (estimatorState.isFixedPrice) {
    totalAmount = Math.round(estimatorState.rate * Math.max(1, Math.round(estimatorState.weight)));
    weightText = `${Math.max(1, Math.round(estimatorState.weight))} Set(s)`;
  } else {
    totalAmount = Math.round(estimatorState.rate * estimatorState.weight);
  }

  if (sumCut) sumCut.textContent = estimatorState.selectedMeat;
  if (sumWeight) sumWeight.textContent = weightText;
  if (sumPrep) sumPrep.textContent = estimatorState.prepStyle;
  if (sumMode) sumMode.textContent = estimatorState.orderMode.includes('Pickup') ? 'Stall Pickup' : 'Home Delivery';
  if (sumTotal) sumTotal.textContent = totalAmount.toLocaleString('en-IN');

  // WhatsApp formatted message builder
  const phone = '7397471230';
  const customerDetails = estimatorState.customerName ? `\n*Customer Info:* ${estimatorState.customerName}` : '';

  const rawMessage =
    `🍗 *SYED BROILERS & MUTTON STALL - ORDER*
----------------------------------------
*Item:* ${estimatorState.selectedMeat}
*Quantity / Weight:* ${weightText}
*Chopping Preference:* ${estimatorState.prepStyle}
*Mode:* ${estimatorState.orderMode}${customerDetails}
*Estimated Total:* ₹${totalAmount.toLocaleString('en-IN')}
----------------------------------------
_Please confirm fresh cut availability & keep packed!_
Stall Location: Anna Nagar, Madurai
Contact: 7397471230 / 6383184080`;

  const encodedMsg = encodeURIComponent(rawMessage);
  const waUrl = `https://wa.me/91${phone}?text=${encodedMsg}`;

  if (waTrigger) {
    waTrigger.href = waUrl;
  }
}

// Quick Add from Catalog Cards to Estimator
function quickAddToEstimator(meatName, rate) {
  const radios = document.querySelectorAll('input[name="meatSelection"]');
  let matched = false;

  radios.forEach(r => {
    if (r.value.toLowerCase().includes(meatName.toLowerCase()) || meatName.toLowerCase().includes(r.value.toLowerCase())) {
      r.checked = true;
      r.dispatchEvent(new Event('change'));
      matched = true;
    }
  });

  if (!matched) {
    estimatorState.selectedMeat = meatName;
    estimatorState.rate = rate;
    updateEstimatorSummary();
  }

  const estimatorSection = document.getElementById('estimator');
  if (estimatorSection) {
    estimatorSection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`Selected "${meatName}" in the Order Estimator!`);
}

/* ==========================================================================
   7. QUICK ORDER MODAL
   ========================================================================== */
let modalCurrentCut = 'Fresh Farm Broiler Chicken';
let modalCurrentRate = 240;
let modalCurrentQty = 1.0;

function openOrderModal(cutName, rate) {
  modalCurrentCut = cutName;
  modalCurrentRate = rate;
  modalCurrentQty = 1.0;

  const modal = document.getElementById('orderModal');
  const title = document.getElementById('modalItemTitle');
  const price = document.getElementById('modalItemPrice');

  if (title) title.textContent = cutName;
  if (price) price.textContent = `₹${rate}`;

  updateModalTotal();

  if (modal) {
    modal.classList.add('open');
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('open');
}

function setModalQty(qty) {
  modalCurrentQty = qty;
  const buttons = document.querySelectorAll('.m-qty-btn');
  buttons.forEach(b => {
    if (parseFloat(b.textContent) === qty) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  updateModalTotal();
}

function updateModalTotal() {
  const totalEl = document.getElementById('modalTotalPrice');
  if (!totalEl) return;
  const total = Math.round(modalCurrentRate * modalCurrentQty);
  totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
}

function sendModalWhatsAppOrder() {
  const prepSelect = document.getElementById('modalPrepSelect');
  const notesInput = document.getElementById('modalNotes');

  const prep = prepSelect ? prepSelect.value : 'Medium Curry Cut';
  const notes = notesInput ? notesInput.value.trim() : '';
  const total = Math.round(modalCurrentRate * modalCurrentQty);

  const notesText = notes ? `\n*Note:* ${notes}` : '';

  const message =
    `🍗 *SYED BROILERS & MUTTON STALL - PRE-ORDER*
----------------------------------------
*Item:* ${modalCurrentCut}
*Weight:* ${modalCurrentQty} kg
*Chopping Style:* ${prep}${notesText}
*Estimated Amount:* ₹${total.toLocaleString('en-IN')}
----------------------------------------
_Please confirm fresh cut availability at Anna Nagar stall._
Contact: 7397471230 / 6383184080`;

  const phone = '7397471230';
  const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  closeOrderModal();
}

// Close modal when clicking outside box
document.addEventListener('click', (e) => {
  const modal = document.getElementById('orderModal');
  if (modal && modal.classList.contains('open') && e.target === modal) {
    closeOrderModal();
  }
});

/* ==========================================================================
   8. FAQ ACCORDION
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
