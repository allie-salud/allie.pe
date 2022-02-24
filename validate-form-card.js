
const isEmpty = str => !str.trim().length;
let labelValidateCard = document.getElementById("number-validate");
let labelValidateCVV = document.getElementById("cvv-validate");

function validateForm(form) {
  console.log("validateForm");
  let isValidateCard = validateCard(form);
  let isValidateCVV = validateCVV(form);
  if(!isValidateCard || !isValidateCVV){
    return false;
  }
  return true;
}

function validateCard(form){
  if(isEmpty(form.number.value)){
    labelValidateCard.innerHTML = "El número de tu tarjeta es obligatorio";
    inputNumberCard.classList.add("is-invalid");
    labelValidateCard.style.display = "block";
    return false;
  }
  if(form.number.value.length < 16){
    labelValidateCard.innerHTML = "Tu tarjeta debe contener 16 dígitos";
    inputNumberCard.classList.add("is-invalid");
    labelValidateCard.style.display = "block";
    return false;
  }
}

function validateCVV(form){
  if(isEmpty(form.cvv.value)){
    labelValidateCVV.innerHTML = "El código de seguridad es obligatorio";
    inputCVV.classList.add("is-invalid");
    labelValidateCVV.style.display = "block";
    return false;
  }
  if(form.cvv.value.length < 3){
    labelValidateCVV.innerHTML = "Tu CVV debe tener entre 3 o 4 dígitos";
    inputCVV.classList.add("is-invalid");
    labelValidateCVV.style.display = "block";
    return false;
  }
}

