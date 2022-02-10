let continuePersonalData = document.getElementById("continue-personal-data");
continuePersonalData.onclick = function() {
  window.dataLayer.push({
      "virtual":{
          "page":"/datos-personales"
      },
      "event":"trackVirtual"
  });
};

let continueSendingData = document.getElementById("continue-sending-data");
continueSendingData.onclick = function() {
  window.dataLayer.push({
      "virtual":{
          "page":"/datos-envio"
      },
      "event":"trackVirtual"
  });
};

let continuePaymentMethod = document.getElementById("continue-payment-method");
continuePaymentMethod.onclick = function() {
  window.dataLayer.push({
      "virtual":{
          "page":"/metodo-pago"
      },
      "event":"trackVirtual"
  });
};


let paymentMethodOptions = document.querySelectorAll('[name="medio_pago"]');
console.log("paymentMethodOptions");
console.log(paymentMethodOptions);
paymentMethodOptions.forEach(function(item) {
  console.log("paymentMethodOptions item");
  console.log(item);
  item.setAttribute("v-on:change", "onChangeSendDataLayer("+"medio_pago"+", $event)");
});

/*
this.input.setAttribute("v-on:change", "updateCart("+productData+", $event)");


let selectedPaymentMethod = $('[name="medio_pago"]:checked').val();
console.log(selectedPaymentMethod);
*/
