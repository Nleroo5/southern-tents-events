/*
  Quote Form - Quantity Selector & Submission Handler
  Southern Tents and Events
*/

// Initialize quantity selectors when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initQuantitySelectors();
  initQuoteFormSubmission();
  setMinimumEventDate();
});

// Set minimum date for event date picker to today
function setMinimumEventDate() {
  const eventDateInput = document.getElementById('event-date');
  if (eventDateInput) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;

    eventDateInput.setAttribute('min', minDate);
  }
}

// Quantity Selector Functionality
function initQuantitySelectors() {
  const plusButtons = document.querySelectorAll('.qty-plus');
  const minusButtons = document.querySelectorAll('.qty-minus');
  const qtyInputs = document.querySelectorAll('.qty-input');

  // Handle + button clicks
  plusButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const itemName = this.getAttribute('data-item');
      const input = document.querySelector(`input[name="${itemName}"]`);
      const card = this.closest('.quantity-card');

      if (input) {
        let currentValue = parseInt(input.value) || 0;
        input.value = currentValue + 1;

        // Add visual feedback
        updateCardState(card, input.value);

        // Small animation
        input.style.transform = 'scale(1.1)';
        setTimeout(() => {
          input.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });

  // Handle - button clicks
  minusButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const itemName = this.getAttribute('data-item');
      const input = document.querySelector(`input[name="${itemName}"]`);
      const card = this.closest('.quantity-card');

      if (input) {
        let currentValue = parseInt(input.value) || 0;
        if (currentValue > 0) {
          input.value = currentValue - 1;

          // Update visual feedback
          updateCardState(card, input.value);

          // Small animation
          input.style.transform = 'scale(0.9)';
          setTimeout(() => {
            input.style.transform = 'scale(1)';
          }, 200);
        }
      }
    });
  });

  // Handle manual input changes
  qtyInputs.forEach(input => {
    input.addEventListener('input', function() {
      const card = this.closest('.quantity-card');

      // Ensure value is not negative
      let value = parseInt(this.value) || 0;
      if (value < 0) {
        value = 0;
        this.value = value;
      }

      // Update card state based on new value
      updateCardState(card, value);
    });

    // Handle blur to clean up the value
    input.addEventListener('blur', function() {
      let value = parseInt(this.value) || 0;
      if (value < 0) {
        value = 0;
      }
      this.value = value;
    });
  });
}

// Update card visual state based on quantity
function updateCardState(card, value) {
  if (parseInt(value) > 0) {
    card.classList.add('has-quantity');
  } else {
    card.classList.remove('has-quantity');
  }
}

// Form Submission with Custom Backend
function initQuoteFormSubmission() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate required fields
    if (!validateForm()) {
      return;
    }

    // Get form data
    const formData = new FormData(form);

    // Convert FormData to JSON object
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></span> Sending...';

    // Add spinner animation inline
    if (!document.getElementById('spinner-style')) {
      const style = document.createElement('style');
      style.id = 'spinner-style';
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    try {
      // Submit to custom backend
      const response = await fetch('http://localhost:3000/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formObject)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success modal
        showThankYouModal();

        // Reset form
        form.reset();

        // Reset all quantity cards
        document.querySelectorAll('.quantity-card').forEach(card => {
          card.classList.remove('has-quantity');
        });
      } else {
        // Handle error
        showAlert('error', data.message || 'There was an error submitting your request. Please try again or call us at 770-328-2920.');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Unable to connect to the server. Please try again or call us at 770-328-2920.');
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Validate form before submission
function validateForm() {
  const form = document.getElementById('contact-form');
  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const phone = form.querySelector('[name="phone"]').value;
  const eventDate = form.querySelector('[name="event-date"]').value;

  if (!name || !email || !phone || !eventDate) {
    showAlert('error', 'Please fill out all required fields.');
    return false;
  }

  // Check if at least one item is selected
  const quantities = form.querySelectorAll('.qty-input');
  let hasItems = false;
  quantities.forEach(input => {
    if (parseInt(input.value) > 0) {
      hasItems = true;
    }
  });

  if (!hasItems) {
    showAlert('error', 'Please select at least one rental item for your quote.');
    return false;
  }

  return true;
}

// Format items for email display
function formatItemsForEmail(formData) {
  let itemsList = '\n\n=== RENTAL ITEMS REQUESTED ===\n';

  const categories = {
    'TENTS': ['tent-20x20', 'tent-20x30', 'tent-30x40', 'tent-40x60'],
    'TABLES': ['table-6ft', 'table-8ft', 'table-60round', 'table-cocktail'],
    'CHAIRS': ['chair-white', 'chair-wood', 'chair-chiavari'],
    'LIGHTING': ['lights-string', 'lights-uplight'],
    'ACCESSORIES': ['dancefloor', 'bar']
  };

  const itemNames = {
    'tent-20x20': '20x20 Frame Tent',
    'tent-20x30': '20x30 Frame Tent',
    'tent-30x40': '30x40 Frame Tent',
    'tent-40x60': '40x60 Pole Tent',
    'table-6ft': '6ft Rectangular Table',
    'table-8ft': '8ft Rectangular Table',
    'table-60round': '60" Round Table',
    'table-cocktail': 'Cocktail Table',
    'chair-white': 'White Folding Chair',
    'chair-wood': 'Wood Folding Chair',
    'chair-chiavari': 'Chiavari Chair',
    'lights-string': 'String Lights (100ft)',
    'lights-uplight': 'Uplighting Fixture',
    'dancefloor': 'Dance Floor (4x4 section)',
    'bar': 'Bar (6ft)'
  };

  Object.keys(categories).forEach(category => {
    let categoryHasItems = false;
    let categoryItems = '';

    categories[category].forEach(item => {
      const qty = formData.get(item);
      if (qty && parseInt(qty) > 0) {
        categoryHasItems = true;
        categoryItems += `  • ${itemNames[item]}: ${qty}\n`;
      }
    });

    if (categoryHasItems) {
      itemsList += `\n${category}:\n${categoryItems}`;
    }
  });

  return itemsList;
}

// Show thank you modal
function showThankYouModal() {
  const modal = document.getElementById('thank-you-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close on backdrop click
    const backdrop = modal.querySelector('.modal-backdrop');
    backdrop.addEventListener('click', closeThankYouModal);

    // Close on Escape key
    document.addEventListener('keydown', handleEscapeKey);
  }
}

// Close thank you modal
function closeThankYouModal() {
  const modal = document.getElementById('thank-you-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

// Handle Escape key to close modal
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeThankYouModal();
  }
}

// Simple alert function (reuse from components.js or implement here)
function showAlert(type, message) {
  // Check if showAlert exists from components.js
  if (typeof window.showAlert === 'function') {
    window.showAlert(type, message);
  } else {
    // Fallback alert implementation
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; max-width: 500px; animation: fadeIn 0.3s;';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }
}
