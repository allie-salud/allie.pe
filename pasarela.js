// var merchantId = '372c1e79e21f4420b954fce1c5830e63';
var merchantId = '80693fa55aeb481bb9ac134ce92b0c2e'; // prod
var kushki = new Kushki({
  merchantId: merchantId,
  inTestEnvironment: false,
});

function subscriptionToken(cardDetails = {}) {
  let submitButton = document.getElementById('cc-form-submit-btn');
  kushki.requestSubscriptionToken(
    {
      currency: 'PEN',
      card: cardDetails,
    },
    function (response) {
      if (!response.code) {
        var tokenInput = document.getElementById('kushki_token_input');
        var kushkiSubscriptionIdInput = document.getElementById(
          'kushki_subscriptionId_input'
        );

        var PAYMENT_GATEWAY_API_ENDPOINT = 'https://payments-api.allie.pe/';
        $.ajax({
          url: PAYMENT_GATEWAY_API_ENDPOINT,
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({
            token: response.token,
            startDate: FIELDS.FIRST_DELIVERY_DATE.val(),
            contactDetails: {
              documentType: FIELDS.DOCUMENT_TYPE.val(),
              documentNumber: FIELDS.DOCUMENT_NUMBER.val(),
              email: FIELDS.EMAIL.val(),
              firstName: FIELDS.GIVEN_NAME.val(),
              lastName: FIELDS.FAMILY_NAME.val(),
              phoneNumber: '+' + FIELDS.COUNTRY_CODE.val() + FIELDS.PHONE.val(),
            },
          }),
          success: function (data) {
            if (data.subscriptionId) {
              window.app.setCard(
                cardDetails.number.slice(-4),
                cardDetails.expiryMonth + '/' + cardDetails.expiryYear
              );
              tokenInput.value = response.token;
              document.getElementById('form-cc-container').style.display =
                'none';
              $('input[name="medio_pago"][value="kushki"]').prop(
                'checked',
                true
              );
              kushkiSubscriptionIdInput.value = data.subscriptionId;
              window.app.validateForm(4);
              form.reset();
            }
          },
          error: function (response) {
            response.readyState;
            var errorData = response.responseJSON;
            let containerErrors =
              document.getElementsByClassName('container-error');
            for (i = 0; i < containerErrors.length; i++) {
              containerErrors[i].style.display = 'flex';
            }
            //Se recibio la respuesta del servidor pero no se pudo procesar
            if (response.readyState === 4) {
              if (errorData.code.toLowerCase() == '006') {
                let containerErrors =
                  document.getElementsByClassName('container-error');
                for (i = 0; i < containerErrors.length; i++) {
                  containerErrors[i].style.display = 'flex';
                }
                document.getElementById('title-error-cc').innerHTML =
                  'Uy! Puede que los datos de tu tarjeta no sean correctos.';
                document.getElementById('message-error-cc').innerHTML =
                  'Intenta nuevamente o con otro medio de pago. ¿Necesitas más información? Comunícate con tu banco.';
              }
              if (errorData.code.toLowerCase() == 'k322') {
                let containerErrors =
                  document.getElementsByClassName('container-error');
                for (i = 0; i < containerErrors.length; i++) {
                  containerErrors[i].style.display = 'flex';
                }
                document.getElementById('title-error-cc').innerHTML =
                  'Lo sentimos, no se logró realizar la transacción.';
                document.getElementById('message-error-cc').innerHTML =
                  'Intenta con otra tarjeta o medio de pago, por favor. ¿Necesitas más información? Comunícate con Kushki.';
              }
            } else {
              //No se recibio respuesta del servidor
              document.getElementById('title-error-cc').innerHTML =
                'Hubo un inconveniente con tu tarjeta.';
              document.getElementById('message-error-cc').innerHTML =
                'Por favor, prueba con otra o cambiando el medio de pago. Si el problema persiste, comunícate con nosotros vía WhatsApp.';
            }
            console.error(
              'Message: ',
              errorData.message || JSON.stringify(errorData)
            );
          },
          complete: function () {
            submitButton.removeAttribute('disabled');
            submitButton.value = submitButton.dataset.label;
          },
        });
      } else {
        if (response.code.toLowerCase() == '006') {
          let containerErrors =
            document.getElementsByClassName('container-error');
          for (i = 0; i < containerErrors.length; i++) {
            containerErrors[i].style.display = 'flex';
          }
          document.getElementById('title-error-cc').innerHTML =
            'Uy! Puede que los datos de tu tarjeta no sean correctos.';
          document.getElementById('message-error-cc').innerHTML =
            'Intenta nuevamente o con otro medio de pago. ¿Necesitas más información? Comunícate con tu banco.';
        }
        if (response.code.toLowerCase() == 'k322') {
          let containerErrors =
            document.getElementsByClassName('container-error');
          for (i = 0; i < containerErrors.length; i++) {
            containerErrors[i].style.display = 'flex';
          }
          document.getElementById('title-error-cc').innerHTML =
            'Lo sentimos, no se logró realizar la transacción.';
          document.getElementById('message-error-cc').innerHTML =
            'Intenta con otra tarjeta o medio de pago, por favor. ¿Necesitas más información? Comunícate con Kushki.';
        }
        submitButton.removeAttribute('disabled');
        submitButton.value = submitButton.dataset.label;
      }
    }
  );
}
