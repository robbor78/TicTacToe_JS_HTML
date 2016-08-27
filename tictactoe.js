Player = {
    CROSS : 0,
    CIRCLE : 1
}

GameState = {
    NONE: 0,
    DRAW: 1,
    WINNER : 2
}

var c;
var ctx;
var width = 0;
var height = 0;
var xstep = 0;
var ystep = 0;
var grid = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
var turn = Player.CROSS;
var drawFunctions = [null,null];
var isGameFinished = false;
var result = GameState.NONE;
var winner = null;
var countPlaced = 0;



function reset() {

    width = c.width;
    height = c.height;

    ctx.clearRect(0, 0, width, height);

    xstep = width/3;
    ystep = height/3;

    grid = [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];

    isGameFinished = false;
    result = GameState.NONE;

    countPlaced = 0;

    SetResultText("");


    drawGrid();

}

function drawGrid() {

    var xmax = width-1;
    var ymax = height-1;

    var x = xstep;
    var y = ystep;

    for (var i=0; i<2; i++) {

        x += i*xstep;
        y += i*ystep;

        ctx.beginPath();

        ctx.moveTo(x,0);
        ctx.lineTo(x,ymax);

        ctx.moveTo(0,y);
        ctx.lineTo(xmax,y);

        ctx.stroke();
    }
}

function onClick(e) {
    var rect = c.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var col = Math.floor(x/xstep);
    var row = Math.floor(y/ystep);

    if (!isGameFinished && grid[col][row]==-1) {
        grid[col][row] = turn;
        countPlaced++;

        isGameFinished = CheckGameFinished(col, row, turn);
        if (isGameFinished) {
            winner = turn;
            result = GameState.WINNER;
        } else if (CheckDraw()) {
            isGameFinished = true;
            winner = null;
            result = GameState.DRAW;
        }

        if (isGameFinished) {
            SetResultText(GetResultText());

        }

        drawFunctions[turn](col,row);

        turn = (turn + 1)%2;
    }


}

function SetResultText(text) {
    var resultText = document.getElementById("resultText");
    resultText.innerHTML = text;
}

function GetResultText() {
    return result == GameState.WINNER ? "The winner is "+ (winner==Player.CROSS?"cross":"circle") : "The game is drawn";
}

function CheckDraw() {
    return countPlaced == 9;
}

function CheckGameFinished(col, row, player) {
    //http://stackoverflow.com/a/1058804/572332

    var colCnt=rowCnt=diagCnt=rdiagCnt=0
    var winner=false;
    var n = 3;
    for (var i=0; i<n && winner == false; i++) {
        if (grid[col][i]==player) { colCnt++;}
        if (grid[i][row]==player) { rowCnt++;}
        if (grid[i][i]==player) { diagCnt++;}
        if (grid[i][n-i-1]==player) { rdiagCnt++;}
    }
    if (rowCnt==n || colCnt==n || diagCnt==n || rdiagCnt==n) { winner=true;}
    
    return winner;
}

function drawCross(col,row) {

    var xstart =  xstep * col +0.1*xstep;
    var ystart = ystep * row+0.1*ystep;
    var xend = (xstep * (col+1))-0.1*xstep;
    var yend = (ystep * (row+1))-0.1*ystep;

    ctx.beginPath();
    ctx.moveTo(xstart,ystart);
    ctx.lineTo(xend,yend);
    ctx.moveTo(xstart,yend);
    ctx.lineTo(xend,ystart);
    ctx.stroke();
}

function drawCircle(col,row) {

    var xcenter = xstep * col + 0.5*xstep;
    var ycenter = ystep * row + 0.5*ystep;

    var radius = 0.4*Math.min(xstep, ystep);

    ctx.beginPath();
    ctx.arc(xcenter, ycenter, radius, 0, 2*Math.PI, false);
    ctx.fill();
}



function draw() {

    drawFunctions[0] = drawCross;
    drawFunctions[1] = drawCircle;

    c = document.getElementById("myCanvas");

    if (c.getContext){
        ctx = c.getContext('2d');

        reset();

        c.addEventListener("click", onClick, false);
    }

}

window.onload = draw;
