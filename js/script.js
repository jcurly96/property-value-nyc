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

// ── Multi-step Valuation Form ────────────────────────────────
(function initValuationForm() {
  const form = document.getElementById('valuation-form');
  if (!form) return;

  let currentStep = 1;
  const totalSteps = 3;

  // Collect all form data across steps
  const data = {};

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
