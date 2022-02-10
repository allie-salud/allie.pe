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

let selectedPaymentMethod = $('[name="medio_pago"]:checked').val();
console.log(selectedPaymentMethod);
