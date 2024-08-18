let board;
let boardwidth = 360;
let boardheight= 640;
let context;
// bird

let birdwidth = 34
let birdheight = 24
let birdX = boardwidth/8
let birdY = boardheight/2

// pipe
let pipeArray=[];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight

}
// physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.3;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");

    // context.fillStyle ="green"
    // context.fillRect(bird.x,bird.y,bird.width,bird.height)

    // draw img
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    
    
    
    }
    // pipeImg

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipe,1500);
    addEventListener("keydown",movebird);
    
    
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y+velocityY,0);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>board.height){
        gameOver = true;
    }

    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollition(bird,pipe)){
            gameOver = true; 
        }
    }
// clear pipes
    while(pipeArray.length>0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();   // remove first Element of array
    }


    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);

    if(gameOver){
        context.fillText("GAME OVER !!!",20,300)
    }
}

function placePipe (){
    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
    let openingSpace = board.height/4

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottompipe ={
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottompipe);

}
function movebird (e){
    if (e.code =="Space" || e.code =="ArrowUp" || e.code == "keyX"){
        // jump
        velocityY = -6;

    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
    }
}

function detectCollition(a,b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}