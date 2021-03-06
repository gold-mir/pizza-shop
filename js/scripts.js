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

Pizza.prototype.getSizeName = function(){
  if (this.size === 0.6){
    return "xs";
  } else if (this.size === 0.75){
    return "s";
  } else if (this.size === 1.4){
    return "lg";
  } else if (this.size === 1.8){
    return "xl";
  } else {
    return "m";
  }
}

Pizza.prototype.getPrice = function(){
  var size = this.size;
  var total = this.basePrice * size;
  this.toppings.forEach(function(topping){
    total += topping.getPrice(size);
  });
  return total;
}

Pizza.prototype.changeSize = function(size){
  if(Pizza.prototype.sizes[size] !== undefined){
    this.size = Pizza.prototype.sizes[size];
  } else {
    this.size = Pizza.prototype.sizes.m;
  }
}

Pizza.prototype.hasTopping = function(topping){
  return this.toppings.indexOf(topping) !== -1;
}

Pizza.prototype.addTopping = function(topping){
  if(this.toppings.indexOf(topping) === -1){
    this.toppings.push(topping);
  }
}

Pizza.prototype.removeTopping = function(topping){
  if(this.hasTopping(topping)){
    this.toppings.splice(this.toppings.indexOf(topping), 1);
  }
}

var pizzas = [];
var activePizza;

function getPizzaByID(id){
  for(var i = 0; i < pizzas.length; i++){
    if(pizzas[i].id === id){
      return pizzas[i];
    }
  }
}

var moveToPizza = function (){
  var toppingJQ = $(this).parent();
  var topping = getToppingByID(parseInt(toppingJQ.attr("name")));
  activePizza.addTopping(topping);

  toppingJQ.remove();
  $("#pizza-toppings-display").append(toppingJQ);
  toppingJQ.find("button").click(moveToTray);
  updatePrices();
}

var moveToTray = function (){
  var toppingJQ = $(this).parent();
  var topping = getToppingByID(parseInt(toppingJQ.attr("name")));
  activePizza.removeTopping(topping);
  updatePrices();

  toppingJQ.remove();
  $("#toppings-list .row:first-child").append(toppingJQ);
  toppingJQ.find("button").click(moveToPizza);
}

function updatePrices(){
  $(".topping").each(function(){
    var topping = getToppingByID(parseInt($(this).attr("name")));
    $(this).find(".price").text(topping.getPrice(activePizza.size).toFixed(2));
  });
  $("#pizza-price").text(activePizza.getPrice().toFixed(2));
}

function resetPizza(){
  activePizza.toppings.forEach(function(topping){
    var toppingHTML = $(`#topping-${topping.id}`);
    toppingHTML.remove();
    $("#toppings-list .row:first-child").append(toppingHTML);
    toppingHTML.find("button").click(moveToPizza);
  });
  activePizza.toppings = [];
  updatePrices();
  $("#size-selection select option[value=m]").prop({selected: true});
}

function setActivePizza(pizza){
  if(pizzas.indexOf(pizza) === -1){
    pizzas.push(pizza);
  }
  activePizza = pizza;
  writeToppings();
  $(`#size-selection select option[value=${pizza.getSizeName()}]`).prop({selected: true});
}

function writeToppings(){
  $("#pizza-toppings-display").text("");
  $("#toppings-list .row:first-child").text("");
  toppings.forEach(function(topping){
    var toppingString =
    `<div class="col-lg-4 col-md-6 col-sm-12 topping" name="${topping.id}"id="topping-${topping.id}">
      <button type="button" class="btn btn-primary">${topping.name} - <span class="price">${topping.price * activePizza.size}</span></button>
    </div>`;
    if(activePizza.hasTopping(topping)){
      $("#pizza-toppings-display").append(toppingString);
      $(`#topping-${topping.id} button`).click(moveToTray);
    } else {
      $("#toppings-list .row:first-child").append(toppingString);
      $(`#topping-${topping.id} button`).click(moveToPizza);
    }
  });
  updatePrices();
}

$(document).ready(function(){
  setActivePizza(new Pizza(Pizza.prototype.sizes.m));

  $("#size-selection select").change(function(){
    activePizza.changeSize($(this).val());
    updatePrices();
  });

  $("#reset-button").click(resetPizza);

  $("#save-button").click(function(){
    if($(`#pizza-${activePizza.id}`).length === 0){
      var pizzaName = prompt("Please name your pizza to save it:");
      var pizzaString =
      `<div class="pizza-selection" name="${activePizza.id}"id="pizza-${activePizza.id}">
        <button type="button" class="btn btn-primary">${pizzaName}</button>
      </div>`
      $("#pizzas-list").append(pizzaString);
      $(`#pizza-${activePizza.id} button`).click(function(){
        var pizza = getPizzaByID(parseInt($(this).parent().attr("name")));
        setActivePizza(pizza);
      });
    }
    setActivePizza(new Pizza(Pizza.prototype.sizes.m));
  });

  writeToppings();
});
