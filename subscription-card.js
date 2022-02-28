// inputNumberCard
let inputNumberCard = document.getElementById("number");
inputNumberCard.oninput = function() {
  this.value = cc_format(this.value)
}
inputNumberCard.setAttribute(
  "onkeypress",
  "return checkDigit(event)"
);

//inputCVV
let inputCVV= document.getElementById("cvv");
inputCVV.setAttribute(
  "onkeypress",
  "return checkDigit(event)"
);

//INPUTS
$('.float-container').find('input').on('keyup blur', function(e){
    // Cache our selectors
    var $this = $(this),
        $parent = $this.parent();

    // Add or remove classes
    if (e.type == 'keyup') {
      if( isEmpty($this.val())) {
        $parent.removeClass('js-show-label');
      } else {
        $parent.addClass('js-show-label');
      }
    } else if (e.type == 'blur') {
      if( isEmpty($this.val())) {
        $parent.removeClass('js-show-label');
      } else {
        $parent.addClass('js-show-label');
      }
    }
});

//SELECTS
$('.float-container').find('select').on('change', function(e){
    // Cache our selectors
    var $this = $(this),
        $parent = $this.parent();

    // Add or remove classes
    if (e.type == 'change') {
      if( isEmpty($this.val())) {
        $parent.removeClass('js-show-label');
      } else {
        $parent.addClass('js-show-label');
      }
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


