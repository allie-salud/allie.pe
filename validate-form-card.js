
const isEmpty = str => !str.trim().length;
let inputNumberCard = document.getElementById("number");
let labelValidateCard = document.getElementById("number-validate");

function validateForm(form) {
  let isValidateCard = validateCard(form);
  if(!isValidateCard){
    return false;
  }
  return true;
}

function validateCard(form){
  if(isEmpty(form.number.value)){
    labelValidateCard.innerHTML = "El número de tu tarjeta es obligatorio";
    inputNumberCard.classList.add("is-invalid");
    labelValidateCard.style.display = "block";
  }
}

