import { subscriptionToken } from "./pasarela";
import { validateForm } from "./validate-form-card";

let inputNumberCard = document.getElementById("number");
inputNumberCard.setAttribute(
  "oninput",
  "this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"
);

var form = document.getElementById("form-cc");

form.onsubmit = function(e){
  e.preventDefault();
  e.stopPropagation();
  window.app.unsetCard();
  var submitButton = document.getElementById('cc-form-submit-btn');
  submitButton.setAttribute("disabled", "disabled");
  submitButton.dataset.label = submitButton.value;
  submitButton.value = submitButton.dataset.wait;
  let isValidate = validateForm(form);
  if(isValidate){
    let cardDetails = {
      name: form.name.value,
      number: form.number.value,
      cvc: form.cvv.value,
      expiryMonth: form.expiry_month.value,
      expiryYear: form.expiry_year.value,
    };

    subscriptionToken(cardDetails);
  }
};


