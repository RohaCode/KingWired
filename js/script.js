const scriptURL =
  "https://script.google.com/macros/s/AKfycbym4mgK2EmB9hkrDXRCzfVqIY1Lh1YZQVw1l6czOyEBolOojs33NJcC3hBvN6aAm0VJ/exec";
const form = document.querySelector(".simple-form");
const modal = document.getElementById("statusModal");
const modalMessage = document.getElementById("modalMessage");
const modalIcon = document.getElementById("modalIcon");

const defaultMessage = modalMessage ? modalMessage.textContent : "";

function showModal(message, isError = false) {
  if (!modal) return;

  modalMessage.textContent = message || defaultMessage;

  modal.classList.add("active");

  setTimeout(() => {
    modal.classList.remove("active");
  }, 3000);
}

const legalModal = document.getElementById("legalModal");
const legalOkBtn = document.getElementById("legalOkBtn");

if (form && legalModal && legalOkBtn) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    legalModal.classList.add("active");
  });

  legalOkBtn.addEventListener("click", () => {
    legalModal.classList.remove("active");

    const submitBtn = form.querySelector(".btn-submit-form");
    const originalBtnText = submitBtn.innerText;
    const emailInput = form.querySelector('input[type="email"]');

    submitBtn.disabled = true;
    submitBtn.innerText = "SENDING...";

    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput.value }),
    })
      .then((response) => {
        form.reset();
        submitBtn.innerText = "SENT!";

        showModal();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }, 3000);
      })
      .catch((error) => {
        console.error("Error!", error.message);

        showModal("Error sending request. Please try again later.", true);

        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      });
  });
}
