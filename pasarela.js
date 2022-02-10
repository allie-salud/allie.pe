// var merchantId = "372c1e79e21f4420b954fce1c5830e63";
var merchantId = "80693fa55aeb481bb9ac134ce92b0c2e"; // prod
var kushki = new Kushki({
	merchantId: merchantId,
	// inTestEnvironment: true,
});

var form = document.getElementById("form-cc");

form.onsubmit = function(e){
	e.preventDefault();
	e.stopPropagation();
	window.app.unsetCard();
	var submitButton = document.getElementById('cc-form-submit-btn');
	submitButton.setAttribute("disabled", "disabled");
	submitButton.dataset.label = submitButton.value;
	submitButton.value = submitButton.dataset.wait;

	var cardDetails = {
		name: form.name.value,
		number: form.number.value,
		cvc: form.cvv.value,
		expiryMonth: form.expiry_month.value,
		expiryYear: form.expiry_year.value,
	};

	kushki.requestSubscriptionToken(
		{
			currency: "PEN",
			card: cardDetails,
		},
		function(response){
			if(!response.code){
				var tokenInput = document.getElementById("kushki_token_input");
				var kushkiSubscriptionIdInput = document.getElementById("kushki_subscriptionId_input");

				window.app.setCard(
					cardDetails.number.slice(-4),
					cardDetails.expiryMonth + '/' + cardDetails.expiryYear);

				/*
				window.app.subscription.payment.type = null;
				window.app.setCard.payment.expiryDate = ;
				*/
				tokenInput.value = response.token;

				var PAYMENT_GATEWAY_API_ENDPOINT = "https://allie-kushki.pytel.workers.dev/";
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
							"phoneNumber": "+" + FIELDS.PHONE.val() + FIELDS.COUNTRY_CODE.val()
						}
					}),
					success: function(data){
						if (data.subscriptionId) {
							// alert("¡Perfecto! Hemos registrado tu tarjeta con éxito");
							document.getElementById('form-cc-container').style.display = 'none';
							$('input[name="medio_pago"][value="kushki"]').prop("checked", true);
							kushkiSubscriptionIdInput.value = data.subscriptionId;
							window.app.validateForm(4);
							form.reset();
						}
					},
					error: function(errorData){
						console.log(errorData.message || JSON.stringify(errorData, null, 2))
					},
					complete: function(){

					}
				});


			} else {
				alert(response.message);
				console.error('Error: ', response.error, 'Code: ', response.code, 'Message: ', response.message);
			}
			submitButton.removeAttribute("disabled");
			submitButton.value = submitButton.dataset.label;
		}
	);
};
