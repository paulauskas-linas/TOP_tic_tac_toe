const gameBoard = (() => {
    const gameBoardArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    const difficultyArray = ["easy", "normal", "hard"];
    
    let currentDifficulty = "easy";

    const changeDifficulty = (value) => {
        if(difficultyArray.includes(value)){
            return currentDifficulty = value
        }
    }
    const statusArray = ["initial", "started", "ended"]
    let gameStatus = "initial";
    const changeGameStatus = (value) => {
        if(statusArray.includes(value)){
            return gameStatus = value;
        }
    }
    const resetBoard = () => {
        gameBoardArray.map(i => i.splice(0, 3, "", "", ""));  
    };
    const setMark = (i,j, mark) => {
        gameBoardArray[i].splice(j, 1, mark);
        changeGameStatus("started");
    };
    const getMark = (i,j) => {
        let mark;
        mark = gameBoardArray[i][j];
        return mark;
    }
    const isMovesLeft = () => {
        return gameBoardArray.flat().some(i => i == "");
    }
    return { 
        get currentDifficulty() {return currentDifficulty;},
        changeDifficulty,
        get gameStatus() {return gameStatus},
        changeGameStatus,
        currentBoardState: gameBoardArray,
        resetBoard,
        setMark,
        getMark,
        isMovesLeft
    };
})();
const displayController = (() => {
    const boardCells = document.querySelectorAll('.board-cell');
    const modalDifficulty = document.querySelector('.modal-difficulty');
    const modalRestart = document.querySelector('.modal-restart');
    const modalResults = document.querySelector('.modal-results');
    const difficultyButtons = document.querySelectorAll('input[type="radio"]');
    const restartBtn = document.querySelector('.btn-restart');
    const confirmDifficultyBtn = document.querySelector('#confirm-difficulty');
    const cancelDifficultyBtn = document.querySelector('#cancel-difficulty');
    const confirmRestartBtn = document.querySelector('#confirm-restart');
    const cancelRestartBtn = document.querySelector('#cancel-restart');
    const startAgainBtn = document.querySelector('#start-again');
    const startBtn = document.querySelector('#start-game');
    const resultMessage = document.querySelector(".results-message");
    ///Methods
    const show = (element) => {
        element.classList.add("visible");
    }
    const hide = (element) => {
        element.classList.remove("visible");
    }
    const updateDOMBoard = (i, j, mark) => {
        boardCells.forEach(cell => {
            if(cell.dataset.row == i && cell.dataset.col == j){
                cell.textContent = `${mark}`
            }
        })
    }
    const clearDOMBoard = () => {
        boardCells.forEach(cell => {
            cell.textContent = "";
        })
    }
    const showResults = (message) => {
        modalResults.classList.add("visible");
        resultMessage.textContent = message;
    }
    const highlightWinningCells = () => {
        boardCells.forEach(cell => {
            for(let loc = 0; loc < 3; loc++){
                if(gameFlow.winningCellsLocation[loc][0] == cell.dataset.row && gameFlow.winningCellsLocation[loc][1] == cell.dataset.col){
                    cell.classList.add("highlight")  
                }
            }
        })
    }
    const removeHighlights = () => {
        boardCells.forEach(cell => {
            cell.classList.remove("highlight");
        })
    }
    ///Bind Event Listeners
    boardCells.forEach(cell => {
        cell.addEventListener('click', () => {
            if(cell.textContent == ""){
                cell.textContent = "X";
                i = cell.dataset.row;
                j = cell.dataset.col;
                gameBoard.setMark(i, j, "X");
                gameFlow.checkForWin();
                if (gameBoard.gameStatus != "ended") {
                    gameFlow.makeMove();
                    gameFlow.checkForWin(); 
                }
            }
        })
    })
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
           if((gameBoard.gameStatus == "initial" && gameBoard.currentDifficulty != button.value) || (gameBoard.gameStatus == "started" && gameBoard.currentDifficulty == button.value) ){
                gameBoard.changeDifficulty(button.value);
           } else {
            show(modalDifficulty);
            confirmDifficultyBtn.addEventListener('click', () => {
                gameBoard.changeDifficulty(button.value);
                gameBoard.resetBoard();
                hide(modalDifficulty);
                clearDOMBoard();
            });
            cancelDifficultyBtn.addEventListener('click', () => {
                hide(modalDifficulty);
                button.checked = false;
                difficultyButtons.forEach(button => {
                    if(button.value == gameBoard.currentDifficulty){
                        button.checked = true;
                    }
                })
            });
           }
        }
        )
    });
    restartBtn.addEventListener('click', () => {
        show(modalRestart);
    });
    cancelRestartBtn.addEventListener('click', () => {
        hide(modalRestart);
    });
    confirmRestartBtn.addEventListener('click', () => {
        hide(modalRestart);
        clearDOMBoard();
        removeHighlights();
        gameBoard.resetBoard();
        gameBoard.changeGameStatus("initial");
        gameFlow.resetWinningCellsLocation();
    });
    startAgainBtn.addEventListener('click', () => {
        gameBoard.resetBoard();
        gameBoard.changeGameStatus("initial");
        gameFlow.resetWinningCellsLocation();
        removeHighlights();
        clearDOMBoard();
        hide(modalResults);
    })
    return {
        difficultyButtons: difficultyButtons,
        updateDOMBoard,
        showResults,
        highlightWinningCells,
        removeHighlights
    }
})();
const gameFlow = (() => {
    let player = 'X', ai = 'O';
    const winningCellsLocation = [
        ["", ""],
        ["", ""],
        ["", ""],
    ];
    const resetWinningCellsLocation = () => {
        winningCellsLocation.map(i => i.splice(0, 2, "", ""));
    }
    const move = (row, col) => {
        return {row, col}
    }
    const decideMoveType = () => {
        let moveType;
        switch (gameBoard.currentDifficulty) {
            case "hard":
                moveType = "best";
                break;
            case "normal":
                chance = Math.floor(Math.random() * 100);
                moveType = chance > 60 ? "best" : "random";
                break;
            default: //easy
                chance = Math.floor(Math.random() * 100);
                moveType = chance > 80 ? "best" : "random";
                break;
        }
        return moveType;
    }
    const decideRandomMove = (board) => {
        i = Math.floor(Math.random() * 3);
        j = Math.floor(Math.random() * 3);
        if (board[i][j] == "") {
            return move(i, j);
        } else {
            return decideRandomMove(board);
        }
    }
    const decideBestMove = (board) => {
        return findBestMove(board);
    }
    const makeMove = () => {
        const board = gameBoard.currentBoardState.slice(0);
        let moveType = decideMoveType();
        let AIMove = moveType == "best" ? decideBestMove(board) : decideRandomMove(board);
        i = AIMove.row;
        j = AIMove.col;
        gameBoard.setMark(i, j, ai);
        displayController.updateDOMBoard(i, j, ai);
    }
    const checkForWin = () => {
        const board = gameBoard.currentBoardState.slice(0);
        result = evaluate(board, true);
        if (result == 10) {
            displayController.highlightWinningCells();
            displayController.showResults("Unfortunately, You lost the game");
            gameBoard.changeGameStatus("ended");
        } else if (result == -10) {
            displayController.highlightWinningCells();
            displayController.showResults("Congratulations, You won the game");
            gameBoard.changeGameStatus("ended");
        } else if (result == 0 && gameBoard.isMovesLeft() == false) {
            displayController.showResults("Well, it is a tie");
            gameBoard.changeGameStatus("ended");
        }
    }
    const evaluate = (b, condition) => {
        // Checking for Rows for X or O victory.
        for(let row = 0; row < 3; row++) {
            if (b[row][0] == b[row][1] &&
                b[row][1] == b[row][2]) {
                if(condition) {
                    winningCellsLocation[0].splice(0,2, row, 0)
                    winningCellsLocation[1].splice(0,2, row, 1)
                    winningCellsLocation[2].splice(0,2, row, 2)
                }
                if (b[row][0] == ai)
                        return +10;
                else if (b[row][0] == player)
                    return -10;
            }
        }
        // Checking for Columns for X or O victory.
        for(let col = 0; col < 3; col++) {
            if (b[0][col] == b[1][col] &&
                b[1][col] == b[2][col]) {
                    if(condition) {
                        winningCellsLocation[0].splice(0,2, 0, col)
                        winningCellsLocation[1].splice(0,2, 1, col)
                        winningCellsLocation[2].splice(0,2, 2, col)
                    }
                if (b[0][col] == ai)
                    return +10;
                else if (b[0][col] == player)
                    return -10;
            }
        }
        // Checking for Diagonals for X or O victory.
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
            if(condition) {
                winningCellsLocation[0].splice(0,2, 0, 0)
                winningCellsLocation[1].splice(0,2, 1, 1)
                winningCellsLocation[2].splice(0,2, 2, 2)
            }
            if (b[0][0] == ai)
                return +10;
            else if (b[0][0] == player)
                return -10;
        }
        if (b[0][2] == b[1][1] &&
            b[1][1] == b[2][0]) {
            if(condition) {
                winningCellsLocation[0].splice(0,2, 0, 2)
                winningCellsLocation[1].splice(0,2, 1, 1)
                winningCellsLocation[2].splice(0,2, 2, 0)
            }
            if (b[0][2] == ai)
                return +10;
            else if (b[0][2] == player)
                return -10;
        }
        // Else if none of them have won then return 0
        return 0;
    }
    const minimax = (board, depth, isMax) => {
        let score = evaluate(board, false);
        // If Maximizer has won the game return his/her evaluated score
        if (score == 10)
            return score;
        // If Minimizer has won the game return his/her evaluated score
        if (score == -10)
            return score;
        // If there are no more moves and no winner then it is a tie
        if (gameBoard.isMovesLeft() == false)
            return 0;
        // If this maximizer's move
        if (isMax) {
            let best = -1000;
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {	
                    if (board[i][j]=="") {
                        board[i][j] = ai;
                        best = Math.max(best, minimax(board, depth + 1, !isMax));
                        board[i][j] = "";
                    }
                }
            }
            return best;
        }
        // If this minimizer's move
        else {
            let best = 1000;
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    if (board[i][j] == "") {
                        board[i][j] = player;
                        best = Math.min(best, minimax(board, depth + 1, !isMax));
                        board[i][j] = "";
                    }
                }
            }
            return best;
        }
    }
    const findBestMove = (board) => {
        let bestVal = -1000;
        const bestMove = move(-1, -1);
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if (board[i][j] == "") {
                    board[i][j] = ai;
                    let moveVal = minimax(board, 0, false);
                    board[i][j] = "";
                    if (moveVal > bestVal) {
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        return bestMove;
    }
    return {
        winningCellsLocation : winningCellsLocation,
        makeMove,
        checkForWin,
        resetWinningCellsLocation
    }
})();