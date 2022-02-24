String.prototype.toCardFormat = function () {
    return this.replace(/[^0-9]/g, "").substr(0, 16).split("").reduce(cardFormat, "");
    function cardFormat(str, l, i) {
        return str + ((!i || (i % 4)) ? "" : " ") + l;
    }
};

let inputCVV= document.getElementById("cvv");
let inputNumberCard = document.getElementById("number");
inputNumberCard.setAttribute(
  "oninput",
  "this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"
);
inputCVV.setAttribute(
  "oninput",
  "this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"
);

$(document).ready(function(){
  //inputNumberCard toCardFormat
  $("#number").keyup(function () {
    $(this).val($(this).val().toCardFormat());
  });
});

var form = document.getElementById("form-cc");

form.onsubmit = function(e){
  console.log("onsubmit");
  e.preventDefault();
  e.stopPropagation();
  window.app.unsetCard();
  let submitButton = document.getElementById('cc-form-submit-btn');
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
  }else{
    submitButton.removeAttribute("disabled");
    submitButton.value = submitButton.dataset.label;
  }
};


