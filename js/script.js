const scriptURL = 'https://script.google.com/macros/s/AKfycbym4mgK2EmB9hkrDXRCzfVqIY1Lh1YZQVw1l6czOyEBolOojs33NJcC3hBvN6aAm0VJ/exec';
const form = document.querySelector('.simple-form');

// Payment Modal Elements
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.querySelector('.close-payment');

function openPaymentModal() {
    if (paymentModal) {
        paymentModal.classList.add('open');
    }
}

function closePaymentModalFunc() {
    if (paymentModal) {
        paymentModal.classList.remove('open');
    }
}

if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', closePaymentModalFunc);
}

// Close modal if clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        closePaymentModalFunc();
    }
});

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = form.querySelector('.btn-submit-form');
    const originalBtnText = submitBtn.innerText;
    const emailInput = form.querySelector('input[type="email"]');
    
    submitBtn.disabled = true;
    submitBtn.innerText = 'PROCESSING...';

    // Send to Google Sheets
    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email: emailInput.value })
    })
    .then(response => {
      // Success: Reset form and Open Payment
      form.reset();
      submitBtn.innerText = 'PLEASE WAIT...';
      
      // Open Payment Modal
      openPaymentModal();
      
      setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
      }, 1000);
    })
    .catch(error => {
      console.error('Error!', error.message);
      
      // Even if Google Sheets fails, we still want them to pay
      openPaymentModal();
      
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
    });
  });
}
