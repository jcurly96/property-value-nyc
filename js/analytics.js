/* ============================================================
   Vercel Web Analytics
   ============================================================ */

// Initialize Vercel Analytics for static HTML site
// This uses the web analytics injection method
(function() {
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Create and inject the analytics script
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  
  // Append to head or body
  const target = document.head || document.body;
  if (target) {
    target.appendChild(script);
  }
})();
