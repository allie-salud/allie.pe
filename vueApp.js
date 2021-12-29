var FIELDS = {
    DOCUMENT_TYPE: $('#documento_tipo'),
    DOCUMENT_NUMBER: $('#documento_numero'),
    EMAIL: $('#email'),
    GIVEN_NAME: $('#nombres'),
    FAMILY_NAME: $('#apellidos'),
    BIRTHDATE_STR: $("#birthdatestr"),
    BIRTHDATE: $('#birthdate'),
    PHONE: $("#phone"),
    EMAIL: $("#email"),
    ADDRESS: $('#direccion'),
    DISTRICT: $('#distrito'),
    FIRST_DELIVERY_DATE: $('#subscription_startdate'),
    FIRST_DELIVERY_SCHEDULE: $("#horario_entrega"),
}

var NUMERIC_INPUTS = [
    FIELDS.DOCUMENT_NUMBER,
    FIELDS.PHONE
]

FIELDS.DOCUMENT_NUMBER.removeAttr('role');
FIELDS.DOCUMENT_TYPE.on('change', function(){
    FIELDS.DOCUMENT_NUMBER.val("");

    if (this.value == 'dni'){
        FIELDS.DOCUMENT_NUMBER.attr('pattern', '[0-9]{8}')
        FIELDS.DOCUMENT_NUMBER.attr('minlength', 8)
        FIELDS.DOCUMENT_NUMBER.attr('maxlength', 8)
    } else {
        FIELDS.DOCUMENT_NUMBER.attr('pattern', '[0-9]{12}')
        FIELDS.DOCUMENT_NUMBER.attr('minlength', 12)
        FIELDS.DOCUMENT_NUMBER.attr('maxlength', 12)
    }
})

var TODAY_DATE = new Date();
var TODAY_STR = TODAY_DATE.toISOString().slice(0, 10);
var HUNDRED_YEARS_AGO = new Date(TODAY_DATE.getFullYear() - 100, 0, 1);
var HUNDRED_YEARS_AGO_STR = HUNDRED_YEARS_AGO.toISOString().slice(0, 10);

FIELDS.BIRTHDATE.attr('max', TODAY_STR);
FIELDS.BIRTHDATE.attr('min', HUNDRED_YEARS_AGO_STR);

var FIRST_DELIVERY_DATE_PICKER = FIELDS.FIRST_DELIVERY_DATE.data('datepicker');
FIELDS.FIRST_DELIVERY_DATE.on('change', function(){
    if (this.validity.customError || this.checkValidity() ){
        var dateParts = this.value.split("/");
        var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, dateParts[0])
        if (date < FIRST_DELIVERY_DATE_PICKER.minDate){
            this.setCustomValidity('Por favor elija una fecha válida.')
        } else {
            this.setCustomValidity('');
        }
        window.app.validateForm(3);
        FIRST_DELIVERY_DATE_PICKER.selectDate(date);
    } else {
        this.reportValidity();
    }
})

var ONLY_DIGITS = function(value){
    if (/\D/g.test(value)) {
        value = value.replace(/\D/g,'')
    }
    return value
}

for (var i = 0; i < NUMERIC_INPUTS.length; i++) {
    var _field = NUMERIC_INPUTS[i];
    _field.on('input', function(){
        this.value = ONLY_DIGITS(this.value);
    })
}

function _round2(dec){
    return Math.round( (dec + Number.EPSILON) * 100 ) / 100;
};
Vue.filter('prepend', function (value, prependValue) {
    return prependValue + value;
});
Vue.filter('currencyValue', function (value) {
    return _round2(value).toFixed(2);
})
Vue.filter('toJsonString', function(object) { return JSON.stringify(object); });
window.app = new Vue({
    el: '#subscribe-form',
    data: {
        errors: {
            1: null,
            2: null,
            3: null,
            4: null
        },
        subscription: {
            method: {},
            products: [],
        },
        payment: {},
        cardSet: false
    },
    computed: {
        cartWithProducts: function(){},
        methodSubtotal: function(){ return this.subscription.method.price || 0 },
        productsSubtotal: function(){ return this.subscription.products.reduce(function (sum, product){ return sum + product.price * product.quantity }, 0); },
        deliverySubtotal: function(){ return 5;},
        subscriptionTotal: function() {
            return this.methodSubtotal + this.productsSubtotal + this.deliverySubtotal;
        },
        subDetails: function() {
            return {
                method: {
                    slug: this.subscription.method.slug,
                    price: this.subscription.method.price
                },
                products: this.subscription.products.map(function(prod){
                    return {
                        slug: prod.slug,
                        quantity: prod.quantity,
                        price: prod.price
                    }
                })
            }
        }
    },
    methods: {
        validateForm: function(index){
            console.log("Validating step", index);
            switch (index) {
                case 1:
                    var noDelivery = (this.methodSubtotal + this.productsSubtotal);
                    console.log("noDelivery", noDelivery);
                    if (noDelivery > 0 && noDelivery < 10.00) {
                        this.errors[index] = "El monto total de la suscripción debe ser mayor o igual a 15 soles."
                    } else if (noDelivery == 0) {
                        this.errors[index] = "No tienes productos en el carrito";
                    } else {
                        this.errors[index] = false;
                    };
                    break;
                case 2:
                    var error;
                    var inputs = [
                        FIELDS.DOCUMENT_NUMBER,
                        FIELDS.EMAIL,
                        FIELDS.GIVEN_NAME,
                        FIELDS.FAMILY_NAME,
                        FIELDS.BIRTHDATE_STR,
                        FIELDS.BIRTHDATE,
                        FIELDS.PHONE,
                        FIELDS.EMAIL
                    ]

                    for (var i = 0; i < inputs.length; i++) {
                        var _input = inputs[i].get(0);

                        if (!_input.checkValidity()) {
                            error = "Por favor, ingresa correctamente todos los campos requeridos.";
                            // _input.reportValidity()
                            break;
                        }
                    }
                    if (error){
                        this.errors[index] = error;
                    } else {
                        this.errors[index] = false;
                    }
                    break;
                case 3:
                var error;
                    var inputs = [
                        FIELDS.ADDRESS,
                        FIELDS.DISTRICT,
                        FIELDS.FIRST_DELIVERY_DATE,
                        FIELDS.FIRST_DELIVERY_SCHEDULE,
                    ]

                    for (var i = 0; i < inputs.length; i++) {
                        var _input = inputs[i].get(0);

                        if (!_input.checkValidity()) {
                            error = "Por favor, ingresa correctamente todos los campos requeridos.";
                            // _input.reportValidity()
                            break;
                        }
                    }

                    if (error){
                        this.errors[index] = error;
                    } else {
                        this.errors[index] = false;
                    }
                    break;
                case 4:
                    var selected = $('[name="medio_pago"]:checked').val()

                    if (!selected || (selected == 'kushki' && !$('#kushki_token_input').val())) {
                        $('[name="medio_pago"]').prop('checked', false);
                        $('.card-pago .w-radio-input').removeClass('w--redirected-checked');
                        this.errors[index] = "Por favor, seleccione un método de pago."
                    } else {
                        this.errors[index] = false;
                    }
                    return;
            }
        },
        hasErrors: function(index){ return this.getErrors(index); }, // Se mantiene por motivos de compatibilidad
        getErrors: function(index){
            return this.errors[index];
        },
        removeMethod: function(){
            this.subscription.method = {};
            $('.product-select-radio-button-wrapper input').prop('checked', false).parent().parent().removeClass('selected');
            this.validateForm(1);
        },
        setCard: function(lastDigits, expiryDate){
            this.payment.number = lastDigits;
            this.payment.expiryDate = expiryDate;
            this.cardSet = true;
        },
        updateCart: function(productData, event){
            var quantity = parseInt(event.target.value);
            if ( Number.isInteger(quantity) ) {
                console.log("Quantity updated ("+ quantity + ") for product " + productData.slug);
                var cartItemIndex = this.subscription.products.findIndex(
                function(product){ return product.slug == productData.slug});
                if (cartItemIndex < 0) {
                    this.subscription.products.push({
                        slug: productData.slug,
                        title: productData.title,
                        price: productData.price,
                        brand: productData.brand,
                        lab: productData.lab,
                        presentation: productData.presentation,
                        image: productData.image,
                        quantity: quantity,
                        _type: productData._type,
                    })
                } else {
                    // cartItem.price : productData.price;
                    if (quantity < 1) {
                        this.subscription.products.splice(cartItemIndex, 1);
                    } else {
                        this.subscription.products[cartItemIndex].quantity = quantity;
                    }
                }
                console.log('input_qty_' + productData.slug);
                document.getElementById('input_qty_' + productData.slug).value = quantity;
            } else {
                console.error("Not a valid quantity");
            }
            this.validateForm(1);
        }
    }
})
