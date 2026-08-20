
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

let spans;      /* Array for each line and span for each character in each array. */
let characters = [];        /* Array(44) [ "T", "h", "e", … ] */
let brElArr = [];       /* <br> for each line */

let inputBuffer = [];

const commands = new Map([
    ["h", moveLeft],
    ["j", moveDown],
    ["k", moveUp],
    ["l", moveRight],
    ["x", deleteChar],
    ["dd", deleteLine],
    ["i", insertCommand],
]);

let mode = "normal";        /* "insert" or "normal" */

const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "JavaScript allows you to manipulate elements on a web page.",
    "Learning Vim requires repetition and practice.",
    "Functions allow you to organize reusable pieces of codeeeeeeeeeeeeeeeeeeeeee."
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

function isPossibleCommand(input) {
    for(const command of commands.keys()) {
        if (command.startsWith(input)) return true;
    }
    return false;
}

function parseInput(event) {
    inputBuffer.push(event.key);

    let input = inputBuffer.join("");
    if (commands.get(input)) {
        inputBuffer.length = 0;
        return commands.get(input);
    }
    else if (isPossibleCommand(input)) {
        return null;
    }
    inputBuffer.length = 0;
    return null;
}

function updateCursor() {
    const row = spans[cursor.row];

    if (row.length > 0) {
        row[cursor.col].before(cursorElement);
    } else {
        brElArr[cursor.row].before(cursorElement);
    }

    cursorElement.scrollIntoView({
        behavior: "instant",
        block: "nearest",
        inline: "nearest"
    });
}

function moveCursor(colOrRow, change) {

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

function moveUp() {
    if (cursor.row > 0) {
        moveCursor("row", -1);
    }
}

function moveLeft() {
    if (cursor.col > 0) {
        moveCursor("col", -1);
    }
}

function moveRight() {
    if (cursor.col < spans[cursor.row].length - 1) {
        moveCursor("col", +1);
    }
}

function moveDown() {
    if (cursor.row < spans.length - 1) {
        moveCursor("row", +1);
    }
}

function deleteChar() {
    characters[cursor.row].splice(cursor.col, 1);

    spans[cursor.row][cursor.col].remove();
    spans[cursor.row].splice(cursor.col, 1);

    if (cursor.col >= characters[cursor.row].length) {
        cursor.col = Math.max(0, characters[cursor.row].length - 1);
    }
    updateCursor();
}

function deleteLine() {
    if (brElArr.length > 0) {
        const cursorWasOnLastLine = cursor.row == characters.length - 1;

        if (brElArr.length > 1) {
            brElArr[cursor.row].remove();
            brElArr.splice(cursor.row, 1);
        }

        for (const span of spans[cursor.row]) {
            span.remove();
        }
        spans.splice(cursor.row, 1);
        characters.splice(cursor.row, 1);

        if (cursorWasOnLastLine == true) {
            cursor.row--;
            updateCursor();
        }
    }
}

function insertCommand() {
    mode = "insert";
}

function exitInsertMode() {
    mode = "normal";
}

function handleInsertMode(event) {
    const span = document.createElement("span");
    span.textContent = event.key;

    spans[cursor.row].splice(cursor.col, 0, span);
    characters[cursor.row].splice(cursor.col, 0, event.key);

    if (spans[cursor.row][cursor.col + 1]) {
        spans[cursor.row][cursor.col + 1].before(span);
    } else {
        brElArr[cursor.row].before(span);
    }

    cursor.col++;
    updateCursor();

}

function handleKeyPress(event) {
    if (mode === "normal") {
        const func = parseInput(event);
        if (func !== null) func();
    }
    else {
        console.log("test");
        if (event.key === "Escape") {
            exitInsertMode();
        }
        else {
            handleInsertMode(event);
        }
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