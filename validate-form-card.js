
const isEmpty = str => !str.trim().length;
let labelValidateCard = document.getElementById("number-validate");

let labelValidateCVV = document.getElementById("cvv-validate");

let inputExpiryMonth = document.getElementById("expiry_month");
let inputExpiryYear = document.getElementById("expiry_year");
let labelValidateExpiryMonthAndYear= document.getElementById("expiry-month-and-year-validate");

let inputName = document.getElementById("name");
let labelValidateName = document.getElementById("name-validate");

function validateForm(form) {
  let isValidateCard = validateCard(form);
  let isValidateCVV = validateCVV(form);
  let isValidateExpiryMonthAndYear = validateExpiryMonthAndYear(form);
  let isValidateName = validateName(form);
  console.log("isValidateCard => ", isValidateCard);
  console.log("isValidateCVV => ", isValidateCVV);
  console.log("isValidateExpiryMonthAndYear => ", isValidateCard);
  console.log("isValidateName => ", isValidateName);
  if(!isValidateCard || !isValidateCVV || !isValidateExpiryMonthAndYear || !isValidateName){
    if(isValidateCard){
      labelValidateCard.style.display = "none";
    }
    if(isValidateCVV){
      labelValidateCVV.style.display = "none";
    }
    if(isValidateExpiryMonthAndYear){
      labelValidateExpiryMonthAndYear.style.display = "none";
    }
    if(isValidateName){
      labelValidateName.style.display = "none";
    }
    return false;
  }
  labelValidateCard.style.display = "none";
  labelValidateCVV.style.display = "none";
  labelValidateExpiryMonthAndYear.style.display = "none";
  labelValidateName.style.display = "none";
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

function validateExpiryMonthAndYear(form){
  if(isEmpty(form.expiry_month.value) || isEmpty(form.expiry_year.value)){
    labelValidateExpiryMonthAndYear.innerHTML = "Elige la fecha de vencimiento de tu tarjeta";
    if(isEmpty(form.expiry_month.value)){
      inputExpiryMonth.classList.add("is-invalid");
    }
    if(isEmpty(form.expiry_year.value)){
      inputExpiryMonth.classList.add("is-invalid");
    }
    labelValidateExpiryMonthAndYear.style.display = "block";
    return false;
  }

  let myActualDate= new Date();
  let yearActual = myActualDate.getFullYear().toString().slice(-2);
  let monthActual = parseInt(myActualDate.getMonth())+1;
  if(yearActual === form.expiry_year.value){
    if(monthActual > form.expiry_month.value){
      labelValidateExpiryMonthAndYear.innerHTML = "Esta fecha de vencimiento no es válida";
      inputExpiryMonth.classList.add("is-invalid");
      labelValidateExpiryMonthAndYear.style.display = "block";
      return false;
    }
  }
}


function validateName(form){
  if(isEmpty(form.name.value)){
    labelValidateName.innerHTML = "Ingresa el nombre que aparece en tu tarjeta";
    inputName.classList.add("is-invalid");
    labelValidateName.style.display = "block";
    return false;
  }
}
