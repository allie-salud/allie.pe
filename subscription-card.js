// inputNumberCard
let inputNumberCard = document.getElementById("number");
inputNumberCard.oninput = function() {
  this.value = cc_format(this.value)
}
inputNumberCard.setAttribute(
  "onkeypress",
  "return checkDigit(event)"
);

//floatContainerNumber
const floatContainerNumber = document.getElementById('floatContainerNumber')
inputNumberCard.addEventListener('focus', () => {
  floatContainerNumber.classList.add('active');
});
inputNumberCard.addEventListener('blur', (event) => {
  if(isEmpty(event.target.value)){
    floatContainerNumber.classList.remove('active');
  }
});

//inputCVV
let inputCVV= document.getElementById("cvv");
inputCVV.setAttribute(
  "onkeypress",
  "return checkDigit(event)"
);

//floatContainerCVV
const floatContainerCVV = document.getElementById('floatContainerCVV')
inputCVV.addEventListener('focus', () => {
  floatContainerCVV.classList.add('active');
});
inputCVV.addEventListener('blur', (event) => {
  if(isEmpty(event.target.value)){
    floatContainerCVV.classList.remove('active');
  }
});

//inputName
let inputName= document.getElementById("name");

//floatContainerName
const floatContainerName = document.getElementById('floatContainerMonth')
inputName.addEventListener('focus', () => {
  floatContainerName.classList.add('active');
});
inputName.addEventListener('blur', (event) => {
  if(isEmpty(event.target.value)){
    floatContainerName.classList.remove('active');
  }
});

//inputExpiryMonth
let inputExpiryMonth = document.getElementById("expiry_month");
//floatContainerMonth
const floatContainerMonth = document.getElementById('floatContainerMonth')
inputExpiryMonth.addEventListener('change', () => {
  if(isEmpty(inputExpiryMonth.value)){
    $('#floatContainerMonth .float-label-select').animate({opacity: 0}, 240);
    floatContainerMonth.classList.remove('active');
  }else{
    $('#floatContainerMonth .float-label-select').animate({opacity: 1}, 240);
    floatContainerMonth.classList.add('active');
  }
});

//inputExpiryYear
let inputExpiryYear = document.getElementById("expiry_year");
//floatContainerYear
const floatContainerYear = document.getElementById('floatContainerYear')
inputExpiryYear.addEventListener('change', () => {
  if(isEmpty(inputExpiryYear.value)){
    $('#floatContainerYear .float-label-select').animate({opacity: 0}, 240);
    floatContainerYear.classList.remove('active');
  }else{
    $('#floatContainerYear .float-label-select').animate({opacity: 1}, 240);
    floatContainerYear.classList.add('active');
  }
});

function checkDigit(event) {
    var code = (event.which) ? event.which : event.keyCode;

    if ((code < 48 || code > 57) && (code > 31)) {
        return false;
    }

    return true;
}

function cc_format(value) {
  var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  var matches = v.match(/\d{4,16}/g);
  var match = matches && matches[0] || ''
  var parts = []
  for (i=0, len=match.length; i<len; i+=4) {
    parts.push(match.substring(i, i+4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

var form = document.getElementById("form-cc");

form.onsubmit = function(e){
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
      number: form.number.value.replace(/ /g, ""),
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


