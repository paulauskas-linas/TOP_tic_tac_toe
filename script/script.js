//game board module
const gameBoard = (() => {
    const gameBoardArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    const logArray = () => {
        console.log(gameBoardArray)
    };
    const pushArray = (a, b, k) => {
        gameBoardArray[a].splice(b, 1, k);
        logArray();
    }
    return { 
        logArray: logArray,
        pushArray: pushArray 
    };
})();

//display controller module
const displayController = (() => {


})();

//game flow module 
const gameFlow = (() =>{

})();

//functions to render game board
//player module? all computer logic goes into game flow logic?
// function for players to put mark and show it on DOM
//do not let players put markers on the taken cells
//a logic that checks when the game is over (row, column, diagonal), check for a tie
//modal to announce win/lose state
//restart game button
//use minimax to create AI for game
