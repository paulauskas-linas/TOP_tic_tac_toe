//game board module
const gameBoard = (() => {
    const gameBoardArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    const logArray = () => console.log(gameBoardArray);
    const pushArray = (a, b, k) => {
        gameBoardArray[a].splice(b, 1, k);
        logArray();
    };
    const resetBoard = () => {
        for(let i = 0; i < 3; i++)
            for(let j = 0; j < 3; j++)
                gameBoardArray[i][j] == ""
    };
    const setMark = (i,j, mark) => gameBoardArray[i].splice(j, 1, mark);
    const getMark = (i,j, mark) => {
        let mark;
        mark = gameBoardArray[i][j];
        return mark;
    }
    const isMovesLeft = (gameBoardArray) => {
        for(let i = 0; i < 3; i++)
            for(let j = 0; j < 3; j++)
                if (gameBoardArray[i][j] == "")
                    return true;
        return false;
    }
    return { 
        logArray,
        pushArray,
        resetBoard,
        setMark,
        getMark,
        isMovesLeft
    };
})();

//display controller module
const displayController = (() => {


})();

//game flow module 
const gameFlow = (() =>{

    const move = (row, col) => {
        return {row, col}
    }

    let player = 'X', ai = 'O';

    const evaluate = (b) => {
        // Checking for Rows for X or O victory.
        for(let row = 0; row < 3; row++)
        {
            if (b[row][0] == b[row][1] &&
                b[row][1] == b[row][2])
            {
                if (b[row][0] == ai)
                    return +10;
                else if (b[row][0] == player)
                    return -10;
            }
        }
        // Checking for Columns for X or O victory.
        for(let col = 0; col < 3; col++)
        {
            if (b[0][col] == b[1][col] &&
                b[1][col] == b[2][col])
            {
                if (b[0][col] == ai)
                    return +10;

                else if (b[0][col] == player)
                    return -10;
            }
        }
        // Checking for Diagonals for X or O victory.
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
        {
            if (b[0][0] == ai)
                return +10;
            else if (b[0][0] == player)
                return -10;
        }
        if (b[0][2] == b[1][1] &&
            b[1][1] == b[2][0])
        {
            if (b[0][2] == ai)
                return +10;
            else if (b[0][2] == player)
                return -10;
        }
        // Else if none of them have
        // won then return 0
        return 0;
    }

    // This is the minimax function. It considers all the possible ways the game can go and returns the value of the gameBoardArray
    const minimax = (gameBoardArray, depth, isMax) =>
    {
        let score = evaluate(gameBoardArray);
        // If Maximizer has won the game
        // return his/her evaluated score
        if (score == 10)
            return score;
        // If Minimizer has won the game
        // return his/her evaluated score
        if (score == -10)
            return score;
        // If there are no more moves and
        // no winner then it is a tie
        if (gameBoard.isMovesLeft() == false)
            return 0;
        // If this maximizer's move
        if (isMax)
        {
            let best = -1000;
            // Traverse all cells
            for(let i = 0; i < 3; i++)
            {
                for(let j = 0; j < 3; j++)
                {	
                    // Check if cell is empty
                    if (gameBoardArray[i][j]=="")
                    {
                        // Make the move
                        gameBoardArray[i][j] = ai;
                        // Call minimax recursively
                        // and choose the maximum value
                        best = Math.max(best, minimax(gameBoardArray,
                                        depth + 1, !isMax));
                        // Undo the move
                        gameBoardArray[i][j] = "";
                    }
                }
            }
            return best;
        }
        // If this minimizer's move
        else
        {
            let best = 1000;
            // Traverse all cells
            for(let i = 0; i < 3; i++)
            {
                for(let j = 0; j < 3; j++)
                {
                    // Check if cell is empty
                    if (gameBoardArray[i][j] == "")
                    {
                        // Make the move
                        gameBoardArray[i][j] = player;
                        // Call minimax recursively and
                        // choose the minimum value
                        best = Math.min(best, minimax(gameBoardArray,
                                        depth + 1, !isMax));
                        // Undo the move
                        gameBoardArray[i][j] = "";
                    }
                }
            }
            return best;
        }
    }

    // This will return the best possible
    // move for the ai
    const findBestMove = (gameBoardArray) =>
    {
        let bestVal = -1000;
        const bestMove = move(-1, -1);

        // Traverse all cells, evaluate
        // minimax function for all empty
        // cells. And return the cell
        // with optimal value.
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                // Check if cell is empty
                if (gameBoardArray[i][j] == "")
                {
                    // Make the move
                    gameBoardArray[i][j] = ai;
                    // compute evaluation function
                    // for this move.
                    let moveVal = minimax(gameBoardArray, 0, false);
                    // Undo the move
                    gameBoardArray[i][j] = "";
                    // If the value of the current move
                    // is more than the best value, then
                    // update best
                    if (moveVal > bestVal)
                    {
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        return bestMove;
    }
})();

//functions to render game gameBoard
//player module? all computer logic goes into game flow logic?
// function for players to put mark and show it on DOM
//do not let players put markers on the taken cells
//a logic that checks when the game is over (row, column, diagonal), check for a tie++
//modal to announce win/lose state
//restart game button
//use minimax to create AI for game++
//add difficulty setting
