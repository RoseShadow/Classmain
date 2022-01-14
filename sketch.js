const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;

var bg_img;
var food;
var rabbit;

var button;
var bunny;
var blink,eat,sad;
var cloud,cloudGroup;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
 
  blink=loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat= loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad= loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  blink.playing=true;
  eat.playing=true;
  sad.playing=true;

  sad.looping=false;
  eat.looping=false;
}

function setup() {
  createCanvas(500,700);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);
  
  rope = new Rope(7,{x:245,y:30});
  ground = new Ground(200,690,600,20);

  //speed of animation
  blink.frameDelay=17;
  eat.frameDelay=17;
  sad.frameDelay=17;


  bunny = createSprite(230,620,100,100);
  bunny.scale = 0.2;
  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  
  bunny.changeAnimation('blinking');

  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);

  cloudGroup= new Group();
   
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,490,690);

  //null check
  if(fruit!=null){ //not null - available
  image(food,fruit.position.x,fruit.position.y,70,70);
  }

  if(keyDown("LEFT_ARROW")){

    bunny.x-=10;
  }
  if(keyDown("RIGHT_ARROW")){

    bunny.x+=10;
  }

  rope.show();
  Engine.update(engine);
  ground.show();

  
   if(collide(fruit,bunny)==true){
     bunny.changeAnimation('eating');
   }
   
   if (collide(fruit,ground.body)==true){
      bunny.changeAnimation('crying');
    }

    if(fruit===null){
      spawnWaterMelon();
    }
    for(var a=0;a< cloudGroup.length;a++){
      if (cloudGroup[a].isTouching(bunny)){
        cloudGroup[a].destroy();
         bunny.addAnimation('eating',eat);
      }
    }

 
   drawSprites();
}

function drop()
{
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function collide(body,sprite){ //body-melon,ground //sprite-bunny

  if(body!=null){
    //dist(a.x,a.y,b.x,b.y)
    var d=dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);

    if(d <= 80){ //collision detection
      World.remove(world,fruit);
      fruit=null;
      return true; //true=1
      
    }
    else{
     return false; //false=0
    }
  }
  
}

function spawnWaterMelon(){
  if(frameCount%60==0){
  cloud = createSprite(Math.round(random(80,350)),10,40,10);
  cloud.velocityY=3
  cloud.addImage(food);
  cloud.scale = 0.1;

  cloudGroup.add(cloud);
  }

}
