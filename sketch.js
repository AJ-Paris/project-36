var dog,sadDog,happyDog;
var foodobj;
var database;
var addFood, feed;
var foodStock;
var feedTime;
var lastFed;
var foodS = 0;

function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000,400);
  database = firebase.database();
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  foodobj = new Food();
  foodStock = database.ref("foodStock");
  foodStock.on("value", readStock);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

}

function draw() {
  background(46,139,87);
  foodobj.display();

  feedTime = database.ref('feedTime');
  feedTime.on('value', function(data){
    lastFed = data.val();
  })

  fill(255);
  textSize(15);
  if(lastFed >=12){
    text('Last Feed : ' + lastFed%12 + 'pm', 350, 30);
  }
  else if(lastFed === 0){
    text('Last Feed : 12am', 350, 30);
  }
  else{
    text('Last Feed : ' + lastFed + 'am', 350, 30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodStock = data.val();
  foodobj.updateFoodStock(foodStock);
}


//function to update food stock and last fed time


//function to add food in stock
function feedDog(){
  dog.addImage(happyDog);
  var foodStockValue = foodobj.getFoodStock();

  if(foodStockValue<=0){
    foodobj.updateFoodStock(foodStockValue * 0);
  }
  else{
    foodobj.updateFoodStock(foodStockValue -1);
  }
  database.ref('/').update({
    foodStock : foodobj.getFoodStock(),
    feedTime : hour()
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    foodStock : foodS
  })
}
