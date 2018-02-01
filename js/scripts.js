function Topping(name, price){
  this.name = name;
  this.price = price;
  this.id = Topping.prototype.id++;
}

Topping.prototype.id = 0;

Topping.prototype.getPrice = function(size){
  return this.price * size;
}

var toppings = [new Topping("Fancy Cheese", 1.1), new Topping("Bacon", 4), new Topping("Pineapple", 1.5), new Topping("Feta", 1.3), new Topping("Chicken", 2.2)
, new Topping("Pepperoni", 2.5), new Topping("Olives", .9), new Topping("Spinach", 0.5), new Topping("Tomatoes", .4), new Topping("Cat Hair", -4), new Topping("Ground Beef", 2.8), new Topping("Onions", 1.1)];

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
  var size = this.size;
  var total = this.basePrice * size;
  this.toppings.forEach(function(topping){
    total += topping.getPrice(size);
  });
  return total;
}

Pizza.prototype.addTopping = function(topping){
  if(this.toppings.indexOf(topping) === -1){
    this.toppings.push(topping);
  }
}

Pizza.prototype.removeTopping = function(topping){
  var toppingIndex = this.toppings.indexOf(topping)
  if(toppingIndex !== -1){
    this.toppings.splice(toppingIndex, 1);
  }
}

//frontend

var pizzas = [];
var activePizza;
var pizzaSize;

var addToPizza = function (){
  var topping = getToppingByID(parseInt($(this).attr("name")));
  activePizza.addTopping(topping);
  updateTotalPrice();

  $(this).remove();
  $("#pizza-toppings-display").append(this);
  $(this).click(removeFromPizza);
}

var removeFromPizza = function (){
  var topping = getToppingByID(parseInt($(this).attr("name")));
  activePizza.removeTopping(topping);
  updateTotalPrice();

  $(this).remove();
  $("#toppings-list .row:first-child").append(this);
  $(this).click(addToPizza);
}

function updatePizzaSize(value){
  if(Pizza.prototype.sizes[value] !== undefined){
    pizzaSize = Pizza.prototype.sizes[value];
  } else {
    pizzaSize = Pizza.prototype.sizes["m"];
  }
  activePizza.size = pizzaSize;
}

function updateTotalPrice(){
  $("#pizza-price").text(activePizza.getPrice().toFixed(2));
}

function updatePrices(){
  $(".topping").each(function(){
    var topping = getToppingByID(parseInt($(this).attr("name")));
    $(this).find(".price").text(topping.getPrice(pizzaSize).toFixed(2));
  });
}

function resetPizza(){
  activePizza.toppings.forEach(function(topping){
    var toppingHTML = $(`#topping-${topping.id}`);
    toppingHTML.remove();
    $("#toppings-list .row:first-child").append(toppingHTML);
    toppingHTML.click(addToPizza);
  });
  activePizza.toppings = [];
  updateTotalPrice();
}

function writeTopping(topping){
  var toppingString =
  `<div class="col-lg-4 col-md-6 col-sm-12 topping" name="${topping.id}"id="topping-${topping.id}">
    <button type="button" class="btn btn-primary">${topping.name} - <span class="price">${topping.price * pizzaSize}</span></button>
  </div>`;
  $("#toppings-list .row:first-child").append(toppingString);
  $(`#topping-${topping.id}`).click(addToPizza);
}

$(document).ready(function(){
  activePizza = new Pizza(Pizza.prototype.sizes.m)
  updateTotalPrice();
  pizzas.push(activePizza);
  updatePizzaSize($("#size-selection select").val());

  $("#size-selection select").change(function(){
    updatePizzaSize($(this).val());
    updatePrices();
    updateTotalPrice();
  });

  $("#reset-button").click(resetPizza);

  $("#order-button").click(function(){
    alert(`The total cost of your Pizza will be $${activePizza.getPrice()}.`);
    resetPizza();
  });

  toppings.forEach(function(topping){
    writeTopping(topping);
  });
});
