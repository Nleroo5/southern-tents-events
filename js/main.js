/*
  Main JavaScript
  Southern Tents and Events
*/

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  initMobileNav();
  initHeaderScroll();
  initActiveNav();

  // Initialize forms
  initFormValidation();

  // Initialize gallery
  initGallery();

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize lazy loading for images
  lazyLoadImages();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Don't prevent default for empty hash or hash-only links
      if (href === '#' || href === '') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL without jumping
        history.pushState(null, null, href);
      }
    });
  });

  // Add current year to footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Performance: Preload critical resources
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  if ('connection' in navigator && navigator.connection.effectiveType) {
    // Adjust behavior based on connection speed
    const connectionType = navigator.connection.effectiveType;
    if (connectionType === 'slow-2g' || connectionType === '2g') {
      // Disable non-critical animations on slow connections
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }

  // Log initialization
  console.log('Southern Tents and Events website initialized');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any running animations or videos when tab is not visible
    const videos = document.querySelectorAll('video');
    videos.forEach(video => video.pause());
  }
});

// Service Worker registration (for PWA capabilities - optional)
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(err => console.log('SW registration failed:', err));
  });
}
