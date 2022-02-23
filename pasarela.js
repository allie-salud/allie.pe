var merchantId = "372c1e79e21f4420b954fce1c5830e63";
// var merchantId = "80693fa55aeb481bb9ac134ce92b0c2e"; // prod
var kushki = new Kushki({
  merchantId: merchantId,
  inTestEnvironment: true,
});

export function subscriptionToken(cardDetails = {}){
  kushki.requestSubscriptionToken(
    {
      currency: "PEN",
      card: cardDetails,
    },
    function(response){
      if(!response.code){
        var tokenInput = document.getElementById("kushki_token_input");
        var kushkiSubscriptionIdInput = document.getElementById("kushki_subscriptionId_input");

        var PAYMENT_GATEWAY_API_ENDPOINT = "https://dev-payments-api.allie.pe/";
        $.ajax({
          url: PAYMENT_GATEWAY_API_ENDPOINT,
          type: 'POST',
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({
            "token": response.token,
            "startDate": FIELDS.FIRST_DELIVERY_DATE.val(),
            "contactDetails": {
              "documentType": FIELDS.DOCUMENT_TYPE.val(),
              "documentNumber": FIELDS.DOCUMENT_NUMBER.val(),
              "email": FIELDS.EMAIL.val(),
              "firstName": FIELDS.GIVEN_NAME.val(),
              "lastName": FIELDS.FAMILY_NAME.val(),
              "phoneNumber": "+" + FIELDS.COUNTRY_CODE.val() + FIELDS.PHONE.val()
            }
          }),
          success: function(data){
            if (data.subscriptionId) {
              window.app.setCard(
                cardDetails.number.slice(-4),
                cardDetails.expiryMonth + '/' + cardDetails.expiryYear
              );
              tokenInput.value = response.token;
              document.getElementById('form-cc-container').style.display = 'none';
              $('input[name="medio_pago"][value="kushki"]').prop("checked", true);
              kushkiSubscriptionIdInput.value = data.subscriptionId;
              window.app.validateForm(4);
              form.reset();
            }
          },
          error: function(response){
            var errorData = response.responseJSON;
            console.log(JSON.stringify(errorData, null, 2));
            alert(errorData.message || JSON.stringify(errorData))
          },
          complete: function(){
            submitButton.removeAttribute("disabled");
            submitButton.value = submitButton.dataset.label;
          }
        });


      } else {
        alert(response.message);
        console.error('Error: ', response.error, 'Code: ', response.code, 'Message: ', response.message);
        submitButton.removeAttribute("disabled");
        submitButton.value = submitButton.dataset.label;
      }

    }
  );
}


