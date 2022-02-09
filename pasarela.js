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
				window.app.setCard(
					cardDetails.number.slice(-4),
					cardDetails.expiryMonth + '/' + cardDetails.expiryYear,
				);
				// window.app.subscription.payment.type = null;
				// window.app.setCard.payment.expiryDate = ;
				tokenInput.value = response.token;

				// alert("¡Perfecto! Hemos registrado tu tarjeta con éxito");
				document.getElementById('form-cc-container').style.display = 'none';
				window.app.validateForm(4);
				form.reset();
			} else {
				alert(response.message);
				console.error('Error: ', response.error, 'Code: ', response.code, 'Message: ', response.message);
			}
			submitButton.removeAttribute("disabled");
			submitButton.value = submitButton.dataset.label;
		}
	);
};
