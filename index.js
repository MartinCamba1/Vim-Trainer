
/*.   Constants and variables     */

const startGameBtn = document.getElementById("start-round-btn");

const terminalWindow = document.getElementById("vim-terminal");

const terminalText = document.getElementById("terminal-text");

const cursorElement = document.createElement("span");
cursorElement.classList.add("cursor");

let cursor = {
    col: 0,
    row: 0
};

let spans;
let characters = [];
let brElArr = [];


const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "JavaScript allows you to manipulate elements on a web page.",
    "Learning Vim requires repetition and practice.",
    "Functions allow you to organize reusable pieces of codeeeeeeee."
];

/*----------------------------------*/


/*      Functions       */

function spanify(text) {
    characters = [];
    brElArr = [];
    terminalText.innerHTML = "";

    const res = [];
    let rowSpans = [];
    let rowChars = [];

    for (const line of text) {
        rowSpans = [];
        rowChars = [];
        for (const char of line) {
            rowChars.push(char);
            const span = document.createElement("span");
            span.textContent = char;
            rowSpans.push(span);

            
            terminalText.appendChild(span);
        }
        characters.push(rowChars);
        res.push(rowSpans);
        const brEl = document.createElement("br");
        brElArr.push(brEl);
        terminalText.appendChild(brEl);
    }
    return res;
    
}

/*
function blinkingCursor() {
    spans[cursor.row][cursor.col].classList.toggle("cursor");
}
*/

function updateCursor() {
    const row = spans[cursor.row];

    if (row.length > 0) {
        row[cursor.col].before(cursorElement);
    } else {
        brElArr[cursor.row].before(cursorElement);
    }
}

function moveCursor(cursor, colOrRow, change) {

    if (colOrRow == "col") {
        cursor.col = cursor.col + change;

        if (
            cursor.col >= spans[cursor.row].length &&
            cursor.row < spans.length - 1
        ) {
            cursor.row++;
            cursor.col = 0;
        }
    }
    else {
        cursor.row = cursor.row + change;
        
        if (spans[cursor.row].length > 0 &&
            cursor.col >= spans[cursor.row].length) {
            cursor.col = spans[cursor.row].length - 1;
        }
    }
    updateCursor();

}

function moveUp(cursor) {
    if (cursor.row > 0) {
        moveCursor(cursor, "row", -1);
    }
}

function moveLeft(cursor) {
    if (cursor.col > 0) {
        moveCursor(cursor, "col", -1);
    }
}

function moveRight(cursor) {
    if (cursor.col < spans[cursor.row].length - 1) {
        moveCursor(cursor, "col", +1);
    }
}

function moveDown(cursor) {
    if (cursor.row < spans.length - 1) {
        moveCursor(cursor, "row", +1);
    }
}

function deleteChar(cursor) {
    characters[cursor.row].splice(cursor.col, 1);

    spans[cursor.row][cursor.col].remove();
    spans[cursor.row].splice(cursor.col, 1);

    if (cursor.col >= characters[cursor.row].length) {
        cursor.col = Math.max(0, characters[cursor.row].length - 1);
    }
    updateCursor();
}

function handleKeyPress(event) {
    switch(event.key) {
        case ("ArrowLeft"):
        case("h"):
            moveLeft(cursor);
            break;
        
        case ("ArrowDown"):
        case("j"):
            moveDown(cursor);
            break;
        
        case ("ArrowUp"):
        case("k"):
            moveUp(cursor);
            break;
        
        case("ArrowRight"):
        case("l"):
            moveRight(cursor);
            break;
        
        case("x"):
            deleteChar(cursor);
            break;
    }
}


function startRound() {
    startGameBtn.style.display = "none";

    cursor = {
        col: 0,
        row: 0
    };


    /*const randomText = texts[Math.floor(Math.random() * texts.length)];*/
    let randomText = texts;

    spans = spanify(randomText);
    updateCursor();
}


/*----------------------------------*/


/*      Executable code     */


startGameBtn.addEventListener("click", () => startRound());
document.addEventListener("keydown", (event) => handleKeyPress(event));

/*setInterval(blinkingCursor, 500);*/

/*----------------------------------*/