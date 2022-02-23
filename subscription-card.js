let inputNumberCard = document.getElementById("number");
inputNumberCard.setAttribute("oninput", "this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');");
