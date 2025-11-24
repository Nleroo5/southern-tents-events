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

  // Initialize services page anchor scrolling with header offset
  initServicesAnchorScroll();

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
});
