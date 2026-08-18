/* ============================================================
   NYC Property Value — Main Script
   ============================================================ */

// ── Always start at top of page ──────────────────────────────
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ── Navbar scroll effect ─────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile menu ──────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── Hero headline carousel ────────────────────────────────────
(function initHeroCarousel() {
  const badge = document.getElementById('hero-badge');
  const headline = document.getElementById('hero-headline');
  const subtext = document.getElementById('hero-subtext');
  const content = document.querySelector('.hero-content');
  const dots = document.querySelectorAll('.hero-dot');
  if (!badge || !headline || !subtext || !content || !dots.length) return;

  const slides = [
    {
      badge: 'Development Sites',
      headline: 'Does Your <em>NYC Property</em> Have Development Potential?',
      subtext: "We specialize in uncovering hidden development value in NYC buildings — from unused FAR and rezoning upside to condo development sites and multifamily land value. Get a free analysis of what your property could be worth as a development site."
    },
    {
      badge: 'Conversions',
      headline: 'Does Your <em>NYC Property</em> Have Conversion Potential?',
      subtext: "467-m is turning obsolete NYC office and commercial buildings into some of the city's most valuable residential conversions — with tax exemptions up to 90%. Find out if your building qualifies."
    },
    {
      badge: 'Income Valuations',
      headline: "What's the Value of My <em>NYC Property</em> Based on Its Income?",
      subtext: "Get a professional, cap-rate-based valuation of your commercial, multi-family, or mixed-use building — using actual NOI and current market comparables across all five boroughs."
    }
  ];

  let current = 0;
  let timer = null;
  const AUTO_MS = 6000;
  const TRANSITION_MS = 350;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(index) {
    const s = slides[index];
    badge.textContent = s.badge;
    headline.innerHTML = s.headline;
    subtext.textContent = s.subtext;
    dots.forEach((d, i) => {
      const active = i === index;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function goTo(index) {
    if (index === current) return;
    content.classList.add('is-transitioning');
    setTimeout(() => {
      current = index;
      render(current);
      content.classList.remove('is-transitioning');
    }, TRANSITION_MS);
  }

  function next() { goTo((current + 1) % slides.length); }

  function stopAuto() { if (timer) clearInterval(timer); }
  function startAuto() {
    if (prefersReducedMotion) return;
    stopAuto();
    timer = setInterval(next, AUTO_MS);
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      goTo(parseInt(d.dataset.slide, 10));
      startAuto();
    });
  });

  content.addEventListener('mouseenter', stopAuto);
  content.addEventListener('mouseleave', startAuto);

  startAuto();
})();

// ── Multi-step Valuation Form ────────────────────────────────
(function initValuationForm() {
  const form = document.getElementById('valuation-form');
  if (!form) return;

  let currentStep = 1;
  const totalSteps = 3;

  // Collect all form data across steps
  const data = {};

  // ── Toggle income-only vs dev-only fields ───────────────
  function toggleDevFields(isDev) {
    form.querySelectorAll('.income-only').forEach(el => {
      el.style.display = isDev ? 'none' : '';
      el.querySelectorAll('[required]').forEach(input => {
        if (isDev) { input.dataset.wasRequired = '1'; input.removeAttribute('required'); }
        else if (input.dataset.wasRequired) { input.setAttribute('required', ''); }
      });
    });
    form.querySelectorAll('.dev-only').forEach(el => {
      // Keep deliverable-field hidden until is_vacant is answered
      if (el.id === 'deliverable-field') return;
      el.style.display = isDev ? '' : 'none';
    });
    if (!isDev) {
      const df = document.getElementById('deliverable-field');
      if (df) df.style.display = 'none';
    }
    const step2Title = document.getElementById('step2-title');
    if (step2Title) step2Title.textContent = isDev ? 'Site Details' : 'Financial Details';
    const step2Label = form.querySelector('.progress-step[data-step="2"] .step-label');
    if (step2Label) step2Label.textContent = isDev ? 'Site Details' : 'Financials';
  }

  // ── Radio-option buttons ─────────────────────────────────
  form.querySelectorAll('.radio-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const input = opt.querySelector('input[type="radio"]');
      if (!input) return;
      const name = input.name;
      form.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.closest('.radio-option').classList.remove('selected');
      });
      input.checked = true;
      opt.classList.add('selected');
      // Show/hide retail fields
      if (name === 'retail_component') {
        const retailFields = document.getElementById('retail-fields');
        if (retailFields) {
          retailFields.style.display = input.value === 'yes' ? 'block' : 'none';
        }
      }
      // Toggle development site mode
      if (name === 'property_type') {
        toggleDevFields(input.value === 'Development Site');
      }
      // Show/hide deliverable-vacant question based on occupancy answer
      if (name === 'is_vacant') {
        const df = document.getElementById('deliverable-field');
        if (df) df.style.display = input.value === 'Yes — Fully Vacant' ? 'none' : '';
      }
    });
  });

  // ── Validation ───────────────────────────────────────────
  function validateStep(step) {
    let valid = true;

    const required = form.querySelectorAll(`.form-step[data-step="${step}"] [required]`);
    required.forEach(field => {
      clearError(field);
      if (!field.value.trim()) {
        showError(field, 'This field is required.');
        valid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showError(field, 'Please enter a valid email address.');
        valid = false;
      } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        showError(field, 'Please enter a valid phone number.');
        valid = false;
      }
    });

    // Validate radio groups in this step
    const radioGroups = new Set();
    form.querySelectorAll(`.form-step[data-step="${step}"] input[type="radio"][required]`).forEach(r => {
      radioGroups.add(r.name);
    });

    radioGroups.forEach(name => {
      const checked = form.querySelector(`input[name="${name}"]:checked`);
      if (!checked) {
        const group = form.querySelector(`[data-radio-group="${name}"]`);
        if (group) {
          group.style.outline = '2px solid #DC2626';
          group.style.borderRadius = '8px';
          valid = false;
        }
      } else {
        const group = form.querySelector(`[data-radio-group="${name}"]`);
        if (group) { group.style.outline = ''; }
      }
    });

    return valid;
  }

  function showError(field, msg) {
    field.classList.add('error');
    const err = field.parentElement.querySelector('.field-error');
    if (err) { err.textContent = msg; err.classList.add('visible'); }
  }

  function clearError(field) {
    field.classList.remove('error');
    const err = field.parentElement.querySelector('.field-error');
    if (err) err.classList.remove('visible');
  }

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isValidPhone(v) { return /^[\d\s\-\+\(\)]{7,}$/.test(v); }

  // ── Collect data from a step ─────────────────────────────
  function collectStep(step) {
    form.querySelectorAll(`.form-step[data-step="${step}"] input:not([type="radio"]), .form-step[data-step="${step}"] select, .form-step[data-step="${step}"] textarea`).forEach(field => {
      if (field.name) data[field.name] = field.value;
    });
    form.querySelectorAll(`.form-step[data-step="${step}"] input[type="radio"]:checked`).forEach(r => {
      data[r.name] = r.value;
    });
  }

  // ── Update UI for current step ───────────────────────────
  function updateUI() {
    // Hide all steps
    form.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));

    // Show current
    const active = form.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (active) active.classList.add('active');

    // Update progress dots
    form.querySelectorAll('.progress-step').forEach(dot => {
      const n = parseInt(dot.dataset.step);
      dot.classList.remove('active', 'completed');
      if (n === currentStep) dot.classList.add('active');
      if (n < currentStep)   dot.classList.add('completed');
    });

    // Scroll form into view smoothly
    const wrapper = document.querySelector('.form-wrapper');
    if (wrapper) {
      const offset = wrapper.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  // ── Next button ──────────────────────────────────────────
  form.querySelectorAll('.btn-form-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      collectStep(currentStep);
      currentStep = Math.min(currentStep + 1, totalSteps);
      updateUI();
    });
  });

  // ── Back button ──────────────────────────────────────────
  form.querySelectorAll('.btn-form-back').forEach(btn => {
    btn.addEventListener('click', () => {
      currentStep = Math.max(currentStep - 1, 1);
      updateUI();
    });
  });

  // ── Submit ───────────────────────────────────────────────
  const submitBtn = form.querySelector('.btn-form-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      if (!validateStep(currentStep)) return;
      collectStep(currentStep);

      // Show loading
      form.querySelector('.form-steps-wrapper').style.display = 'none';
      form.querySelector('.form-loading').classList.add('active');

      // Build readable submission
      const payload = {
        ...data,
        _subject: `New Property Valuation Request — ${data.address || 'NYC Property'}`,
      };

      try {
        const FORMSPREE_ID = 'mvzdbkkk'; // ← replace after Formspree signup
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });

        // Simulate valuation calculation delay for UX
        await new Promise(r => setTimeout(r, 2200));

        form.querySelector('.form-loading').classList.remove('active');

        if (res.ok) {
          form.querySelector('.form-success').classList.add('active');
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        form.querySelector('.form-loading').classList.remove('active');
        form.querySelector('.form-steps-wrapper').style.display = 'block';
        alert('There was a problem submitting the form. Please try again or email us directly.');
      }
    });
  }

  updateUI();
})();

// ── Reading-time valuation popup (article pages only) ────────
(function initReadingPopup() {
  const articleBody = document.querySelector('.article-body');
  const overlay = document.getElementById('valuation-popup-overlay');
  if (!articleBody || !overlay) return;

  const STORAGE_KEY = 'nycpv_popup_shown';
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  function showPopup() {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    overlay.classList.add('active');
    sessionStorage.setItem(STORAGE_KEY, '1');
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  const timer = setTimeout(showPopup, 10000);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hidePopup();
  });

  const closeBtn = overlay.querySelector('.valuation-popup-close');
  if (closeBtn) closeBtn.addEventListener('click', hidePopup);

  const dismissLink = overlay.querySelector('.valuation-popup-dismiss');
  if (dismissLink) dismissLink.addEventListener('click', (e) => { e.preventDefault(); hidePopup(); });

  const ctaBtn = overlay.querySelector('.valuation-popup-cta');
  if (ctaBtn) ctaBtn.addEventListener('click', hidePopup);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hidePopup();
  });

  window.addEventListener('beforeunload', () => clearTimeout(timer));
})();

// ── Smooth scroll for CTA buttons ───────────────────────────
document.querySelectorAll('a[href="#valuation"]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById('valuation');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Number formatting for income/expense fields ──────────────
document.querySelectorAll('.currency-input').forEach(input => {
  input.addEventListener('blur', () => {
    const num = parseFloat(input.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) input.value = num.toLocaleString('en-US');
  });
  input.addEventListener('focus', () => {
    input.value = input.value.replace(/,/g, '');
  });
});
