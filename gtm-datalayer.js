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
paymentMethodOptions.forEach(function(item) {
  item.onclick = function() {
    const paymentMethod = item.getAttribute("value");
    let textValue = "";
    switch (paymentMethod) {
      case "yape":
        textValue = "POS contra entrega";
      case "yape":
        textValue = "Yape";
      case "transferencia":
        textValue = "Transferencia";
      case "pagolink":
        textValue = "Pago Link / Enlace de pago";
    }
    window.dataLayer.push({
        "action":{
            "category": "Método de pago",
            "name": "Elegir medio de pago",
            "label": textValue
        },
        "event":"trackAction"
    });
  };
});
