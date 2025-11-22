/*
  Interactive Components
  Southern Tents and Events
*/

// Mobile Navigation Toggle
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = throttle(() => {
    // For homepage, services, gallery, FAQ, contact, and terms pages - check if scrolled past hero section
    const hasHero = document.body.classList.contains('home') ||
                    document.body.classList.contains('services') ||
                    document.body.classList.contains('gallery') ||
                    document.body.classList.contains('faq') ||
                    document.body.classList.contains('contact') ||
                    document.body.classList.contains('terms');
    const hero = document.querySelector('.hero');
    const scrollThreshold = hasHero && hero ? hero.offsetHeight : 50;

    if (window.scrollY > scrollThreshold) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }, 100);

  window.addEventListener('scroll', handleScroll);
}

// Active navigation link based on scroll position
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = throttle(() => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 100);

  window.addEventListener('scroll', handleScroll);
}

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formGroups = form.querySelectorAll('.form-group');
      let isValid = true;

      // Clear previous errors
      formGroups.forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.form-error');
        if (errorMsg) errorMsg.textContent = '';
      });

      // Validate each field
      formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (!input) return;

        const errorMsg = group.querySelector('.form-error');
        const label = group.querySelector('.form-label');
        const fieldName = label ? label.textContent.replace('*', '').trim() : 'This field';

        // Required validation
        if (input.hasAttribute('required') && !validators.required(input.value)) {
          isValid = false;
          group.classList.add('error');
          if (errorMsg) errorMsg.textContent = `${fieldName} is required`;
        }

        // Email validation
        if (input.type === 'email' && input.value && !validators.email(input.value)) {
          isValid = false;
          group.classList.add('error');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid email address';
        }

        // Phone validation
        if (input.type === 'tel' && input.value && !validators.phone(input.value)) {
          isValid = false;
          group.classList.add('error');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid phone number';
        }
      });

      if (isValid) {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

        try {
          // TODO: Replace with actual form submission endpoint
          // For now, simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Show success message
          showAlert('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
          form.reset();
        } catch (error) {
          showAlert('error', 'Sorry, there was an error sending your message. Please try again or call us directly.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } else {
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (!group) return;

        const errorMsg = group.querySelector('.form-error');
        const label = group.querySelector('.form-label');
        const fieldName = label ? label.textContent.replace('*', '').trim() : 'This field';

        group.classList.remove('error');
        if (errorMsg) errorMsg.textContent = '';

        if (input.hasAttribute('required') && !validators.required(input.value)) {
          group.classList.add('error');
          if (errorMsg) errorMsg.textContent = `${fieldName} is required`;
        } else if (input.type === 'email' && input.value && !validators.email(input.value)) {
          group.classList.add('error');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid email address';
        } else if (input.type === 'tel' && input.value && !validators.phone(input.value)) {
          group.classList.add('error');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid phone number';
        }
      });

      // Format phone numbers on input
      if (input.type === 'tel') {
        input.addEventListener('input', debounce((e) => {
          const formatted = formatPhoneNumber(e.target.value);
          if (formatted !== e.target.value) {
            e.target.value = formatted;
          }
        }, 300));
      }
    });
  });
}

// Alert/notification system
function showAlert(type, message) {
  const alertHTML = `
    <div class="alert alert-${type} fade-in" role="alert" id="alert-notification">
      ${message}
    </div>
  `;

  // Remove existing alerts
  const existing = document.getElementById('alert-notification');
  if (existing) existing.remove();

  // Insert new alert
  const container = document.querySelector('main') || document.body;
  container.insertAdjacentHTML('afterbegin', alertHTML);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    const alert = document.getElementById('alert-notification');
    if (alert) {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }
  }, 5000);
}

// Simple image gallery/lightbox
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close">&times;</button>
          <img src="${img.src}" alt="${img.alt}">
        </div>
      `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      // Add styles if not already present
      if (!document.getElementById('lightbox-styles')) {
        const styles = document.createElement('style');
        styles.id = 'lightbox-styles';
        styles.textContent = `
          .lightbox {
            position: fixed;
            inset: 0;
            z-index: var(--z-modal);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-4);
          }
          .lightbox-backdrop {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.9);
          }
          .lightbox-content {
            position: relative;
            z-index: 1;
            max-width: 90vw;
            max-height: 90vh;
          }
          .lightbox img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: var(--radius-lg);
          }
          .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: transparent;
            color: white;
            font-size: var(--text-4xl);
            cursor: pointer;
            padding: var(--space-2);
            line-height: 1;
          }
        `;
        document.head.appendChild(styles);
      }

      // Close lightbox
      const closeLightbox = () => {
        lightbox.remove();
        document.body.style.overflow = '';
      };

      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

      // Close on Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  });
}

// Intersection Observer for animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = entry.target.dataset.animate;
        entry.target.classList.add(animation);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMobileNav,
    initHeaderScroll,
    initActiveNav,
    initFormValidation,
    showAlert,
    initGallery,
    initScrollAnimations
  };
}
