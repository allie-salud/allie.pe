$(document).on('click', '.product-method input[type="radio"]', function () {
    if ($(this).is(":checked")) {
        $('.product-method input[type="radio"]').not(this).removeAttr('checked');
        $('.product-method .product-select-item-wrapper').removeClass('selected');
        $(this).parent().parent().addClass('selected');
    }
});

function QuantityInput(elm, startText, decreaseText, increaseText, removeText) {
    var self = this;
    // Create input
    this.input = document.createElement('input');
    this.input.value = 1;
    this.input.type = 'number';
    this.input.name = 'quantity';
    this.input.autocomplete = "off";
    this.input.step = 1;
    var productData = elm.dataset.productData;
    this.input.id = "input_qty_" + elm.dataset.quantity;
    this.input.setAttribute("v-on:change", "updateCart("+productData+", $event)");
    this.input.pattern = '[0-9]+';

    // Get text for buttons
    this.startText = startText || 'Agregar';
    this.decreaseText = decreaseText || 'Reducir cantidad';
    this.increaseText = increaseText || 'Incrementar cantidad';
    this.removeText = removeText || 'Eliminar producto';


    // Button constructor
    function Button(text, className){
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = text;
        this.button.title = text;
        this.button.classList.add(className);

        return this.button;
    }

    // Create buttons
    this.start = new Button(this.startText, 'start');
    this.subtract = new Button(this.decreaseText, 'delete');
    this.add = new Button(this.increaseText, 'add');

    // Add functionality to buttons
    this.subtract.addEventListener('click', function() {self.change_quantity(-1)});
    this.add.addEventListener('click', function() { self.change_quantity(1) });
    this.start.addEventListener('click', function() { self.doStart() });


    // Add input validtion to number input
    this.input.addEventListener('input', function(event) { self.ensure_integers(event) });
    this.input.addEventListener('blur', function(event) { self.ensure_value(event) });


    // Add input and buttons to wrapper
    elm.appendChild(this.subtract);
    elm.appendChild(this.input);
    elm.appendChild(this.add);
    elm.appendChild(this.start);

    this.doStart = function start(){
        this.input.value = 1;
        elm.dataset.started = true;
        this.input.dispatchEvent(new Event('change'));
    }

    this.ensure_integers = function ensure_integers(event){
        // Not ideal solution
        var new_val = event.target.value.replace(/[^0-9]*/g, '');
        event.target.value = '';
        event.target.value = new_val;
    }

    this.ensure_value = function ensure_integers(event){
        // Not ideal solution
        event.target.value = event.target.value || 1;
    }

    this.change_quantity = function change_quantity(change) {
        // Delete item from cart
        if (change < 0 && this.subtract.classList.contains('delete')){
        this.input.value = 0;
        this.input.dispatchEvent(new Event('change'));
        delete elm.dataset.started;
        return;
        }

        // Get current value
        var quantity = Number(this.input.value);

        // Ensure quantity is a valid number
        if (isNaN(quantity)) quantity = 1;

        // Change quantity
        quantity += change;

        // Ensure quantity is always a number
        quantity = Math.max(quantity, 1);

        // Output number
        this.input.value = quantity;
        this.input.dispatchEvent(new Event('change'));

        if (quantity == 1) {
        this.subtract.classList.replace('sub', 'delete');
        this.subtract.innerHTML = this.removeText;
        } else {
        this.subtract.classList.replace('delete', 'sub');
        this.subtract.innerHTML = this.decreaseText;
        }
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
                        "quantity": quantity
                    }]
                }
            },
            "event":"addToCart"
        });
    }
}

$("fieldset.qty-selector").each(function (_i, element) {
    element.changeQuantity = new QuantityInput(element);
});

$('.modal-completo-metodos.productos .collection-item-4').each(function (_i, element) {
    element.dataset.type = $(element).find('fieldset').data('type');
})

$('.checkbox-filter-wrapper input').on('change', function(){
    $('.checkbox-filter-wrapper input').not(this).prop('checked', false);
    var current = this.dataset.slug;
    var active = this.checked;
    var items = $('.modal-completo-metodos.productos .collection-item-4');
    if (active){
        items.hide();
        items.each(function(_i, elm){
        if (elm.dataset.type == current){
            $(elm).show();
        }
        });
    } else {
        items.show();
    }
});
