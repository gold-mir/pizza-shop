function Topping(name, price){
  this.name = name;
  this.price = price;
}

Topping.prototype.getPrice = function(size){
  return this.price * size;
}

function Pizza(size, ...toppings){
  this.size = size;
  this.toppings = toppings;
}

Pizza.prototype.basePrice = 15;
Pizza.prototype.sizes = {xs: 0.6, s: 0.75, m: 1, lg: 1.4, xl: 1.8};

Pizza.prototype.getPrice = function(){
  var total = basePrice * this.size;
  this.toppings.forEach(function(topping){
    total += topping.getPrice(this.size);
  });
  return total;
}

$(document).ready(function(){
  
});
