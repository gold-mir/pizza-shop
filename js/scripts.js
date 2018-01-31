function Topping(name, price){
  this.name = name;
  this.price = price;
  this.id = Topping.prototype.id++;
}

Topping.prototype.id = 0;

Topping.prototype.getPrice = function(size){
  return this.price * size;
}

var toppings = [new Topping("Cheese", 1), new Topping("Bacon", 3), new Topping("Pineapple", 1.5)];

function getToppingByID(id){
  for(let i = 0; i < toppings.length; i++){
    if(toppings[i].id === id){
      return toppings[i];
    }
  }
  return undefined;
}

function Pizza(size, ...toppings){
  this.size = size;
  this.toppings = toppings;
  this.id = Pizza.prototype.id++;
}

Pizza.prototype.id = 0;

Pizza.prototype.basePrice = 15;
Pizza.prototype.sizes = {xs: 0.6, s: 0.75, m: 1, lg: 1.4, xl: 1.8};

Pizza.prototype.getPrice = function(){
  var total = basePrice * this.size;
  this.toppings.forEach(function(topping){
    total += topping.getPrice(this.size);
  });
  return total;
}

var addToPizza = function (){
  $(this).remove();
  $("#pizza-display").append(this);
  $(this).click(removeFromPizza);
}

var removeFromPizza = function (){
  $(this).remove();
  $("#toppings-list .row:first-child").append(this);
  $(this).click(addToPizza);
}

var pizzaSize;

function updatePizzaSize(value){
  if(Pizza.prototype.sizes[value] !== undefined){
    pizzaSize = value;
  } else {
    pizzaSize = "m";
  }
}

function updatePrices(){
  $(".topping").each(function(){
    var topping = getToppingByID(parseInt($(this).attr("name")));
    $(this).find(".price").text(topping.getPrice(Pizza.prototype.sizes[pizzaSize]).toFixed(2));
  });
}

$(document).ready(function(){
  updatePizzaSize($("#size-selection select").val());

  $("#size-selection select").change(function(){
    updatePizzaSize($(this).val());
    updatePrices();
  });

  toppings.forEach(function(topping){

    var toppingString =
    `<div class="col-lg-4 col-md-6 col-sm-12 topping" name="${topping.id}"id="topping-${topping.id}">
      <button type="button" class="btn btn-secondary">${topping.name} - <span class="price">${topping.price * Pizza.prototype.sizes[pizzaSize]}</span></button>
    </div>`;
    $("#toppings-list .row:first-child").append(toppingString);
    $(`#topping-${topping.id}`).click(addToPizza);
  });
});
