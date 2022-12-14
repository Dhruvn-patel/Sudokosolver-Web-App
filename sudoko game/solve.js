var arr=[[],[],[],[],[],[],[],[],[]];
var temp=[[],[],[],[],[],[],[],[],[]];

for(var i=0;i<9;i++)
{
    for(var j=0;j<9;j++)
    {
        arr[i][j]=document.getElementById(i *9 + j);
    }
}

function inittemp(temp)
{
for(var i=0;i<9;i++)
{
    for(var j=0;j<9;j++)
    {
       temp[i][j]=false;
    }
}
}

function setcolor()
{
    for(var i=0;i<9;i++)
    {
        for(var j=0;j<9;j++)
        {
             if(temp[i][j]==true)
              arr[i][j].style.color="#DC3545";
        }
    }
}

function resetcolor()
{
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

function settemp(board,temp)
{
    for(var i=0;i<9;i++)
    {
        for(var j=0;j<9;j++)
        {
             if(board[i][j]!=0)
             temp[i][j]=true;
        }
    }
}

var board=[[],[],[],[],[],[],[],[],[]];

let btn = document.getElementById('generate-sudoku');
let solve = document.getElementById('solve');

// console.log(btn);
// console.log(arr)
function changeBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {

                arr[i][j].innerText=board[i][j];
            }

            else
                arr[i][j].innerText = ''
        }
    }
}


btn.onclick = function () {
    var xhrRequest = new XMLHttpRequest()
    xhrRequest.onload = () => {
        var response = JSON.parse(xhrRequest.response);
        console.log(response);
        inittemp(temp);
        resetcolor();

        board = response.board;
        settemp(board, temp);
        setcolor(temp);
        changeBoard(board);
    }
    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
    xhrRequest.send()
}

// you can make a call to changeboard(board) function to update the state on the screen
//returns a boolean true of false

function isSafe(board,r,c,k){

  //not repeating in the same row or column 
  for(var i=0;i<9;i++){
    if(board[i][c]==k || board[r][i]==k){
        return false;
    }
    // a=Math.round((3*r/3)+i/3);
    // b=Math.round((3*c/3) + i % 3);
    // // console.log(a+ " "+ b);
    // if(board[a][b]==k)return false;
    
}
//subgrid
var sx = r - r%3;
var sy = c - c%3;

for(var x=sx;x<sx+3;x++){
    for(var y=sy;y<sy+3;y++){
        if(board[x][y]==k){
            return false;
        }
    }
}

return true;
}

function solveSudokuHelper(board,r,c){

    //every row visited
    if(r==9)
    {
        //base case
        changeBoard(board);
        return true;
    }
    // one row completed after goes to next row
    if(c==9)
    {
        return solveSudokuHelper(board,r+1,0);
    }
    //filled values ignore
    if(board[r][c]!=0)
    {
        return  solveSudokuHelper(board,r,c+1);  
    }

     for(var i=1;i<=9;i++)
     {
        if(isSafe(board,r,c,i)==true)
        {
            board[r][c]=i;
            if(solveSudokuHelper(board,r,c+1)==true) return true;
            board[r][c]=0; // backtracking condition
        }

     }
     
    return false;
}

function solveSudoku(board) {
   solveSudokuHelper(board,0,0);
}


solve.onclick = function () {
  solveSudoku(board)
}

