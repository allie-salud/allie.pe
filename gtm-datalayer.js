let continuePersonalData = document.getElementById('continue-personal-data');
continuePersonalData.onclick = function () {
  window.dataLayer.push({
    virtual: {
      page: '/datos-personales',
    },
    event: 'trackVirtual',
  });
};

let continueSendingData = document.getElementById('continue-sending-data');
continueSendingData.onclick = function () {
  window.dataLayer.push({
    virtual: {
      page: '/datos-envio',
    },
    event: 'trackVirtual',
  });
};

let continuePaymentMethod = document.getElementById('continue-payment-method');
continuePaymentMethod.onclick = function () {
  window.dataLayer.push({
    virtual: {
      page: '/metodo-pago',
    },
    event: 'trackVirtual',
  });
};

let paymentMethodOptions = document.querySelectorAll('[name="medio_pago"]');
paymentMethodOptions.forEach(function (item) {
  item.onclick = function () {
    const paymentMethod = item.getAttribute('value');
    let textValue = '';
    switch (paymentMethod) {
      case 'pos':
        textValue = 'POS contra entrega';
        break;
      case 'yape':
        textValue = 'Yape';
        break;
      case 'transferencia':
        textValue = 'Transferencia';
        break;
      case 'pagolink':
        textValue = 'Pago Link / Enlace de pago';
        break;
    }
    window.dataLayer.push({
      action: {
        category: 'Método de pago',
        name: 'Elegir medio de pago',
        label: textValue,
      },
      event: 'trackAction',
    });
  };
});

let recurringCardPayment = document.getElementById('recurring-card-payment');
recurringCardPayment.onclick = function () {
  window.dataLayer.push({
    virtual: {
      page: '/ingresar-tarjeta',
    },
    event: 'trackVirtual',
  });
};

let acceptTyc = document.getElementById('accept-tyc');
acceptTyc.onclick = function () {
  let checkboxDiv = document.getElementsByClassName('checkbox-tyc');
  checkboxDiv[0].classList.add('w--redirected-checked');
  let checkboxInput = document.getElementById('tac-tyc');
  checkboxInput.checked = true;
  let today = new Date();
  let date =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let hour =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  let dateAndHour = date + ' ' + hour;
  document.getElementById('input-date-tyc').value = dateAndHour;
};

let cancelTyc = document.getElementById('cancel-tyc');
cancelTyc.onclick = function () {
  let checkboxDiv = document.getElementsByClassName('checkbox-tyc');
  checkboxDiv[0].classList.remove('w--redirected-checked');
  let checkboxInput = document.getElementById('tac-tyc');
  checkboxInput.checked = false;
};

let acceptPdd = document.getElementById('accept-pdd');
acceptPdd.onclick = function () {
  let checkboxDiv = document.getElementsByClassName('checkbox-tyc');
  checkboxDiv[0].classList.add('w--redirected-checked');
  let checkboxInput = document.getElementById('tac-tyc');
  checkboxInput.checked = true;
  let today = new Date();
  let date =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let hour =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  let dateAndHour = date + ' ' + hour;
  document.getElementById('input-date-tyc').value = dateAndHour;
};

let cancelPdd = document.getElementById('cancel-pdd');
cancelPdd.onclick = function () {
  let checkboxDiv = document.getElementsByClassName('checkbox-tyc');
  checkboxDiv[0].classList.remove('w--redirected-checked');
  let checkboxInput = document.getElementById('tac-tyc');
  checkboxInput.checked = false;
};

let acceptBnp = document.getElementById('accept-bnp');
acceptBnp.onclick = function () {
  let checkboxDiv = document.getElementsByClassName('checkbox-bnp');
  checkboxDiv[0].classList.add('w--redirected-checked');
  let checkboxInput = document.getElementById('tac-bnp');
  checkboxInput.checked = true;
  let today = new Date();
  let date =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let hour =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  let dateAndHour = date + ' ' + hour;
  document.getElementById('input-date-bnp').value = dateAndHour;
};

let cancelBnp = document.getElementById('cancel-bnp');
cancelBnp.onclick = function () {
  let checkboxDiv = document.getElementsByClassName('checkbox-bnp');
  checkboxDiv[0].classList.remove('w--redirected-checked');
  let checkboxInput = document.getElementById('tac-bnp');
  checkboxInput.checked = false;
};

$('#tac-tyc').on('change', function () {
  let today = new Date();
  let date =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let hour =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  let dateAndHour = date + ' ' + hour;
  document.getElementById('input-date-tyc').value = dateAndHour;
});

$('#tac-bnp').on('change', function () {
  let today = new Date();
  let date =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let hour =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  let dateAndHour = date + ' ' + hour;
  document.getElementById('input-date-bnp').value = dateAndHour;
});
