var PROMO_CODE_API_ENDPOINT = "https://allie-promo-codes.pytel.workers.dev/";

var FIELDS = {
    DOCUMENT_TYPE: $('#documento_tipo'),
    DOCUMENT_NUMBER: $('#documento_numero'),
    EMAIL: $('#email'),
    GIVEN_NAME: $('#nombres'),
    FAMILY_NAME: $('#apellidos'),
    BIRTHDATE_STR: $("#birthdatestr"),
    BIRTHDATE: $('#birthdate'),
    PHONE: $("#phone"),
    COUNTRY_CODE: $("#id_numero_codigo_area"),
    EMAIL: $("#email"),
    ADDRESS: $('#direccion'),
    DISTRICT: $('#distrito'),
    FIRST_DELIVERY_DATE_STR: $('#subscription_startdate'),
    FIRST_DELIVERY_DATE: $('#id_fecha_entrega'),
    FIRST_DELIVERY_SCHEDULE: $("#horario_entrega"),
    COUPON_CODE: $('#coupon_code'),
}

const uuid = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
})

var NUMERIC_INPUTS = [
    FIELDS.DOCUMENT_NUMBER,
    FIELDS.PHONE
]

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

// FIELDS.DOCUMENT_NUMBER.removeAttr('role');
FIELDS.DOCUMENT_TYPE.on('change', function(){
    FIELDS.DOCUMENT_NUMBER.val("");
    FIELDS.DOCUMENT_NUMBER.off('input');

    if (this.value == 'dni'){
        FIELDS.DOCUMENT_NUMBER.attr('inputmode', 'numeric');
        FIELDS.DOCUMENT_NUMBER.attr('pattern', '[0-9]{8}');
        FIELDS.DOCUMENT_NUMBER.attr('minlength', 8);
        FIELDS.DOCUMENT_NUMBER.attr('maxlength', 8);
        FIELDS.DOCUMENT_NUMBER.on('input', function(){
            this.value = ONLY_DIGITS(this.value);
        });
    } else {
        FIELDS.DOCUMENT_NUMBER.attr('inputmode', 'text');
        FIELDS.DOCUMENT_NUMBER.attr('pattern', '[0-9a-zA-Z]{8,12}');
        FIELDS.DOCUMENT_NUMBER.attr('minlength', 8);
        FIELDS.DOCUMENT_NUMBER.attr('maxlength', 12);
    }
})

var TODAY_DATE = new Date();
var TODAY_STR = TODAY_DATE.toISOString().slice(0, 10);
var HUNDRED_YEARS_AGO = new Date(TODAY_DATE.getFullYear() - 100, 0, 1);
var HUNDRED_YEARS_AGO_STR = HUNDRED_YEARS_AGO.toISOString().slice(0, 10);

FIELDS.BIRTHDATE.attr('max', TODAY_STR);
FIELDS.BIRTHDATE.attr('min', HUNDRED_YEARS_AGO_STR);

FIELDS.BIRTHDATE_STR.on('change blur', function(){
    var self = this;
    setTimeout(function(){
        if (self.value == '00/00/0000'){
            self.value = '';
            window.app.validateForm(2);
        } else if (!self.checkValidity() && !self.validity.customError){
            self.reportValidity();
        } else {
            var bd_element = FIELDS.BIRTHDATE.get(0);
            var date_parts = self.value.split("/");
            var date_obj_parts = bd_element.value.split("-").reverse();

            if (date_parts.join() == date_obj_parts.join()){
                if (!bd_element.checkValidity()){
                    self.setCustomValidity(bd_element.validationMessage);
                    window.app.validateForm(2);
                } else {
                    self.setCustomValidity('');
                }
            } else {
                self.setCustomValidity("Por favor elija una fecha válida");
                self.reportValidity();
            }
        }
    }, 10)
});

FIELDS.FIRST_DELIVERY_DATE_STR.on('keydown', function(){
    return false;
})

var FIRST_DELIVERY_DATE_PICKER = FIELDS.FIRST_DELIVERY_DATE_STR.data('datepicker');
FIELDS.FIRST_DELIVERY_DATE_STR.on('change', function(){
    if (this.value && this.validity.customError || this.checkValidity() ){
        var dateParts = this.value.split("/");
        console.log("delivery_dateParts", dateParts);
        var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, dateParts[0])
        if (date < FIRST_DELIVERY_DATE_PICKER.minDate || isDisabled(date)){
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



function _round2(dec){
    return Math.round( (dec + Number.EPSILON) * 100 ) / 100;
};
Vue.filter('prepend', function (value, prependValue) {
    return prependValue + value;
});
Vue.filter('currencyValue', function (value) {
    return _round2(value).toFixed(2);
})
Vue.filter('percentageString', function (value) {
    return _round2(value*100).toFixed(0) + "%";
})
Vue.filter('toJsonString', function(object) { return JSON.stringify(object); });
window.app = new Vue({
    el: '#subscribe-form',
    data: {
        invalidCoupon: false,
        loadingCoupon: false,
        coupon: null,
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
        couponApplied: function(){
            return (this.coupon && this.coupon.code) ? this.coupon.code : false;
        },
        cartWithProducts: function(){},
        methodSubtotal: function(){ return this.subscription.method.price || 0 },
        productsSubtotal: function(){
            return this.subscription.products.filter(product => !product.is_once)
                .reduce(function (sum, product){
                    return sum + product.price * product.quantity
                }, 0);
        },
        oneTimeAmount: function(){
            return this.subscription.products.filter(product => product.is_once)
                .reduce(function (sum, product){
                    return sum + product.price * product.quantity
                }, 0).toFixed(2);
        },
        deliverySubtotal: function(){ return 5;},
        subscriptionTotal: function() {
            return this.methodSubtotal + this.productsSubtotal + this.deliverySubtotal;
        },
        onlyOneTime: function() {
            return ((this.methodSubtotal + this.productsSubtotal == 0) && this.oneTimeAmount > 0);
        },
        firstOrderAmount: function() {
            return (this.subscriptionTotal + parseFloat(this.oneTimeAmount)).toFixed(2);
        },
        firstDeliveryTotal: function(){
            let ticketValueForDiscounts = this.methodSubtotal + this.productsSubtotal;
            let discountValue = 0;
            if(this.coupon !== null){
                if (this.coupon.conditions.appliesToDelivery){
                    ticketValueForDiscounts += this.deliverySubtotal;
                }
                discountValue = this.coupon.discount.value || this.coupon.discount.percentage * ticketValueForDiscounts;
                discountValue = Math.min(discountValue, this.coupon.conditions.maximumDiscountValue || Infinity, ticketValueForDiscounts);
            }
            return this.subscriptionTotal + this.oneTimeAmount - discountValue;
        },
        discountValue: function(){
            return this.subscriptionTotal + this.oneTimeAmount - this.firstDeliveryTotal;
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
                        price: prod.price,
                        is_once: prod.is_once
                    }
                })
            }
        }
    },
    methods: {
        applyCode: function(){
            FIELDS.COUPON_CODE = $('#coupon_code');

            var APPLY_COUPON_BUTTON = $('#couponApply');
            if (APPLY_COUPON_BUTTON.hasClass('disabled')) return;
            var self = this;
            var couponEntered = FIELDS.COUPON_CODE.val();
            self.loadingCoupon = true;
            APPLY_COUPON_BUTTON.text('⏳');
            APPLY_COUPON_BUTTON.addClass('disabled');

            $.ajax({
                url: PROMO_CODE_API_ENDPOINT,
                type: 'GET',
                data: { code: couponEntered},
                success: function(data){
                    self.coupon = data.results[0];
                    if (self.coupon.code){
                        FIELDS.COUPON_CODE.val(self.coupon.code);
                        self.invalidCoupon = false;
                    }
                },
                error: function(errorData){
                    // console.dir(errorData);
                    self.invalidCoupon = true;
                },
                complete: function(){
                    self.loadingCoupon = false;
                    APPLY_COUPON_BUTTON.text('Aplicar')
                    APPLY_COUPON_BUTTON.removeClass('disabled');
                }
            });
        },
        removeCoupon: function(){
            FIELDS.COUPON_CODE.val('');
            this.coupon = null;
        },
        validateForm: function(index){
            switch (index) {
                case 1:
                var noDelivery = (this.methodSubtotal + this.productsSubtotal + this.oneTimeAmount);
                if (noDelivery > 0 && noDelivery < 15.00) {
                    this.errors[index] = "Uy! Tu compra debe ser igual o mayor a s/15 (sin contar el delivery)."
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
                    // FIELDS.BIRTHDATE,
                    FIELDS.PHONE,
                    FIELDS.EMAIL
                ]

                for (var i = 0; i < inputs.length; i++) {
                    var _input = inputs[i].get(0);

                    if (!_input.checkValidity()) {
                        error = "Por favor, ingresa correctamente todos los campos requeridos.";
                        inputs[i].closest('.form-input-group, .form-input-field, .form-input-wrapper').addClass('invalid');
                        // _input.reportValidity()
                        // break;
                    } else {
                        inputs[i].closest('.form-input-group, .form-input-field, .form-input-wrapper').removeClass('invalid');
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
                    FIELDS.FIRST_DELIVERY_DATE_STR,
                    FIELDS.FIRST_DELIVERY_SCHEDULE,
                ]

                for (var i = 0; i < inputs.length; i++) {
                    var _input = inputs[i].get(0);

                    if (!_input.checkValidity()) {
                        error = "Por favor, ingresa correctamente todos los campos requeridos.";
                        inputs[i].closest('.form-input-group, .form-input-field, .form-input-wrapper').addClass('invalid');
                        // _input.reportValidity()
                    } else {
                        inputs[i].closest('.form-input-group, .form-input-field, .form-input-wrapper').removeClass('invalid');
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
                    if ( selected == 'kushki') {
                        $('.subscription-payment-automatic .card-pago .w-radio-input').addClass('w--redirected-checked');
                    }
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
        unsetCard: function(){
            this.payment = {};
            this.cardSet = false;
        },
        hasOneTime: function() {
            const productsFilter = this.subscription.products.filter(product => product.is_once);
            const productsMap = productsFilter.length > 0 ? productsFilter.map(item => item.quantity) : [];
            return (productsMap.length > 0 ? productsMap.reduce((prev, curr) => prev + curr, 0) : 0) > 0;
        },
        updateCart: function(productData, event){
            console.log("🚀 ~ file: vueApp.js ~ line 348 ~ productData", productData);
            var quantity = parseInt(event.target.value);
            if ( Number.isInteger(quantity) ) {
                var cartItemIndex = this.subscription.products.findIndex(
                    function(product){ return product.slug == productData.slug});
                    window.dataLayer.push({
                        "ecommerce":{
                            "add":{
                                "products":[{
                                    "id": productData.slug,
                                    "name": productData.title,
                                    "price": productData.price,
                                    "brand": productData.brand,
                                    "category": productData._type,
                                    "variant": productData.presentation,
                                    "is_once": productData.is_once,
                                    "quantity": quantity,
                                    "active_one_time": productData.active_one_time,
                                }]
                            }
                        },
                        "event":"addToCart"
                    });
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
                            is_once: productData.is_once,
                            active_one_time: productData.active_one_time,
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
                    document.getElementById('input_qty_' + productData.slug).value = quantity;
                } else {
                    console.error("Not a valid quantity");
                }
                this.validateForm(1);
            },
            onChangeMethod: function(){
                window.dataLayer.push({
                    "ecommerce":{
                        "add":{
                            "products":[{
                                "id": this.subscription.method.slug,
                                "name": this.subscription.method.title,
                                "price": this.subscription.method.price,
                                "brand": this.subscription.method.lab,
                                "category": "Anticonceptivo",
                                "is_once": this.subscription.method.is_once,
                                "variant": this.subscription.method.presentation,
                                "active_one_time": this.subscription.method.active_one_time,
                                "quantity": 1
                            }]
                        }
                    },
                    "event":"addToCart"
                });
                this.validateForm(1);
            },
            onClickSubscription: function(){
                let idSubscription = document.getElementById("kushki_subscriptionId_input")
                idSubscription = idSubscription.value
                let revenueDataLayer = document.getElementsByClassName("totalamountvalue")
                revenueDataLayer = parseInt(revenueDataLayer[0].innerText)
                let productsDataLayer = this.subscription.products.map(function(product){
                    return {
                        "id": product.slug,
                        "name": product.title,
                        "price": product.price,
                        "brand": product.brand,
                        "category": product._type,
                        "variant": product.presentation,
                        "is_once": product.is_once,
                        "quantity": product.quantity,
                        "active_one_time": product.active_one_time,
                    }
                })
                productsDataLayer.push({
                    "id": this.subscription.method.slug,
                    "name": this.subscription.method.title,
                    "price": this.subscription.method.price,
                    "brand": this.subscription.method.lab,
                    "is_once": this.subscription.method.is_once,
                    "category": "Anticonceptivo",
                    "variant": this.subscription.method.presentation,
                    "active_one_time": this.subscription.method.active_one_time,
                    "quantity": 1
                })
                window.dataLayer.push({
                    "ecommerce":{
                        "purchase":{
                            "actionField":{
                                "id": isEmpty(idSubscription) ? uuid() : idSubscription,
                                "affiliation": "Allie",
                                "revenue": revenueDataLayer,
                                "tax": revenueDataLayer*0.18,
                                "shipping": this.deliverySubtotal
                            },
                            "products": productsDataLayer
                        }
                    },
                    "event":"orderPurchase"
                });
            },
            showTotal: function(caseValue){
                let visible = true;
                switch (caseValue) {
                    case 1:
                        visible = this.methodSubtotal == 0 && this.productsSubtotal == 0 && this.oneTimeAmount > 0 ? false : true;
                        break;
                    case 2:
                        visible = this.methodSubtotal == 0 && this.productsSubtotal == 0 && this.oneTimeAmount > 0 ? true : false;
                        break;
                    case 3:
                        visible = (this.methodSubtotal != 0 || this.productsSubtotal != 0) && this.oneTimeAmount == 0 ? true : false;
                        break;
                    case 4:
                        visible = (this.methodSubtotal != 0 || this.productsSubtotal != 0) && this.oneTimeAmount != 0 ? true : false;
                        break;
                    case 3:
                        visible = (this.methodSubtotal != 0 || this.productsSubtotal != 0) && parseFloat(this.oneTimeAmount) == 0 ? true : false;
                        break;
                    case 4:
                        visible = (this.methodSubtotal != 0 || this.productsSubtotal != 0) && parseFloat(this.oneTimeAmount) != 0 ? true : false;
                        break;
                }
                return visible;
            },
            changeOneTime(item, product){
                product.is_once = !product.is_once;
                let productsChanges = this.subscription.products.map(row => {
                    if(row.slug == product.slug){
                        row.is_once = product.is_once;
                    }
                    return row;
                });
                this.subscription.products = productsChanges;
                if(product.is_once){
                    item.target.classList.add("w--redirected-checked");
                }else{
                    item.target.classList.remove("w--redirected-checked");
                }
            }
        },
    })
