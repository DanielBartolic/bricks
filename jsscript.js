const cvs = document.getElementById("bricks");
const ctx = cvs.getContext("2d");

cvs.style.border = "1px solid #000";

ctx.lineWidth = 2;

//konstante
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
const POWER_UP_RADIUS = 10;

let GAME_OVER = false;
let LIFE = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
let leftArrow = false;
let rightArrow = false;



//premična ploskev
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : 5,
    powered : false
}

//nariši ploskev

function drawPaddle(){



    if(!paddle.powered){
        paddle.width = PADDLE_WIDTH;
        ctx.drawImage(PADDLE_IMG, paddle.x, paddle.y);
    }
    else if(paddle.powered){
        paddle.width = PADDLE_WIDTH*2;
        
        ctx.drawImage(PADDLE_POWER_IMG, paddle.x, paddle.y);
    }
}

//premik 

document.addEventListener("keydown", function(event){
    if(event.keyCode == 37){
        leftArrow = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
    }
});

document.addEventListener("keyup", function(event){
    if(event.keyCode == 37){
        leftArrow = false;
    }else if(event.keyCode == 39){
        rightArrow = false;
    }
});

function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}


const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 3 * (Math.random()*2-1),
    dy : -3
}

function drawBall(){
    
    ctx.beginPath();

    ctx.drawImage(BALL_IMG, ball.x - ball.radius,ball.y - ball.radius);
    

    ctx.closePath();

}

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}



function ballWallCollision(){
    if(ball.x + ball.radius >= cvs.width || ball.x - ball.radius <= 0){
        ball.dx = - ball.dx;
    }

    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
    }

    if(ball.y + ball.radius > cvs.height){
        LIFE --;
        resetBall();
    }
}

function resetBall(){
    ball.x = paddle.x + PADDLE_WIDTH/2;
    ball.y = paddle.y - BALL_RADIUS;

    
    ball.dx = 3 * (Math.random()*2-1);
    ball.dy = -3;
}

function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x &&
        paddle.y < paddle.y + paddle.height && ball.y+ball.radius > paddle.y){
            let collidePoint = ball.x - (paddle.x + paddle.width/2);

            collidePoint = collidePoint / (paddle.width/2);

            let angle = collidePoint * Math.PI/3 //(60)
            
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = - ball.speed * Math.cos(angle);
        }
}

//BRICK

const brick = {
    row : 3,
    column : 10,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop  : 40,
}

let bricks = [];

function createBrick(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y : r * (brick.offSetLeft + brick.height) + brick.offSetTop + brick.marginTop,
                status : true,
                power : 2
            }
        }
    }
}

createBrick();

function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];

            if(b.status){
                // ctx.fillStyle = brick.fillColor;
                // ctx.fillRect(b.x, b.y, brick.width, brick.height);

                // ctx.strokeStyle = brick.strokeColor;
                // ctx.strokeRect(b.x, b.y, brick.width, brick.height);

                if(r != 2){             
                    b.power = 1;
                }

                switch (b.power) {
                    case 1:
                        ctx.drawImage(BROKEN_BRICK_IMG, b.x, b.y);
                      break;
                    case 2:
                        ctx.drawImage(BRICK_IMG, b.x, b.y);
                }
            }
        }
    }

}

function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];

            if(b.status){
                if(ball.x + ball.radius > b.x
                    && ball.x - ball.radius < b.x + brick.width
                    && ball.y + ball.radius > b.y 
                    && ball.y - ball.radius < b.y + brick.height){
                        BRICK_HIT.play();
                        ball.dy = - ball.dy;
                        switch (b.power) {
                            case 1:
                                if((Math.random()<=1) && !powerup.falling && !paddle.powered){
                                    
                                    powerup.falling = true;
                                    powerup.x = b.x+20;
                                    powerup.y = b.y;
                                }
                                b.status = false;
                                SCORE += SCORE_UNIT;
                              break;
                            case 2:
                                b.power --;
                                ctx.drawImage(BRICK_IMG, b.x, b.y);
                        }
                    }
            }
        }
    }

}
const powerup = {
    x : 0,
    y : 0,
    radius : BALL_RADIUS,
    dy : 3,
    falling : false
}

function drawPowerUp(){
    if(powerup.falling){

        ctx.beginPath();
        // ctx.arc(powerup.x, powerup.y, powerup.radius, 0, Math.PI*2);
        // ctx.fillStyle = ctx.createPattern(POWER_IMG, 'repeat');
        // ctx.fill();
        ctx.drawImage(POWER_UP_IMG, powerup.x - powerup.radius,powerup.y - powerup.radius);

        ctx.closePath();

        movePowerUp();

    }

    
}
function movePowerUp(){
    powerup.x = powerup.x;
    powerup.y+= powerup.dy;
   
}

function powerUpCollision(){
    if(powerup.x < paddle.x + paddle.width && powerup.x > paddle.x &&
        paddle.y < paddle.y + paddle.height && powerup.y > paddle.y){
            paddle.powered = true;
            paddle.x = paddle.x - 100;
            resetPowerUp();
            setTimeout(()=>{paddle.powered = false;}, 4000);
    }

    if(powerup.y + powerup.radius > cvs.height){
        resetPowerUp();
    }
}

function resetPowerUp(){
    powerup.falling = false;
    powerup.x = 0;
    powerup.y = 0;

}

function showGameStats(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = "black";
    ctx.font = '20px Arial';
    ctx.fillText(text, textX, textY);


    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}


function gameOver(){
    if(LIFE <= 0){
        // showYouLose();
        location.reload();
        // GAME_OVER = true;
    }else if(SCORE == 300){
        // showYouWin();
        location.reload();
        // GAME_OVER = true;
    }
}



function draw(){
    ctx.drawImage(BACKGROUND_IMG, 0, 0);
    drawPaddle();
    drawBall();
    drawBricks();
    drawPowerUp();
    

    showGameStats(LIFE, cvs.width - 25, 25 , LIFE_IMG, cvs.width-55, 5);
    showGameStats(SCORE, 35, 25 , SCORE_IMG, 5, 5);
}

function update(){
    gameOver();
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    powerUpCollision();
    
    
}

function loop(){
    ctx.clearRect(0,0,cvs.width,cvs.height);

    draw();

    update();

        if(! GAME_OVER){
            requestAnimationFrame(loop);
        }
    
}
loop();

const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    let imgSrc = soundElement.getAttribute("src");
    let SOUNDON_IMG = imgSrc == "slike/sound.png" ? "slike/sound_off.png" :
    "slike/sound.png";

    soundElement.setAttribute("src", SOUNDON_IMG);
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
}