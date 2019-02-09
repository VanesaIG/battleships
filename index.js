class Game {
    constructor(size) {
        this.size = size
        this.matrix = this.init()
        this.ships = [4, 3, 3, 2, 2]
        this.placedShips = 0;
        this.clickCount = 50;
        this.coordinates = {};
        this.tableDOM = document.getElementById("table");
        this.moralSupportDOM = document.getElementById('moral-support');
    }
    placeAShip(shipSize, loop) {
        let row = Math.floor(Math.random() * this.size)
        let column = Math.floor(Math.random() * this.size)
        let direction = Math.floor(Math.random() * 2)
        this.coordinates[loop] = []

        if (direction === 0) {
            if (column + shipSize < this.size) {
                if (!this.matrix[row].slice(column, column + shipSize).some(el => el === 'X')) {
                    for (let i = column; i < column + shipSize; i++) {
                        this.matrix[row][i] = 'X'
                        this.coordinates[loop].push({ row: row, column: i })
                    }
                    this.placedShips++;
                }
            }
        } else if (direction === 1) {
            if (row + shipSize < this.size) {
                let newArr = []
                for (let i = row; i < row + shipSize; i++) {
                    newArr.push(this.matrix[i][column])
                }
                if (!newArr.some(el => el === 'X')) {
                    for (let i = row; i < row + shipSize; i++) {
                        this.matrix[i][column] = 'X'
                        this.coordinates[loop].push({ row: i, column: column })
                    }
                    this.placedShips++;
                }
            }
        }
    }
    placeShips() {
        for (let i = 0; i < this.ships.length; i++) {
            let num = this.placedShips;
            while (num === this.placedShips) {
                this.placeAShip(this.ships[i], i)
            }
        }
        console.log(this.coordinates)
    }
    createTable() {
        let clicksLeftDOM = document.getElementById('clicks-left');        
        let shipsLeftDom = document.getElementById("ships-left");

        shipsLeftDom.innerHTML = `Ships down: 0/${this.ships.length}`;
        clicksLeftDOM.innerHTML = `You have ${this.clickCount} clicks left!`;
        for (let i = 0; i < this.matrix.length; i++) {
            if (i === 0) {
                let row = this.tableDOM.insertRow(i)
                for (let j = 0; j <= this.matrix[i].length; j++) {
                    let cell = row.insertCell(j)
                    cell.className = 'numbers'
                    j > 0 ? cell.innerHTML = j : cell.innerHTML = ''
                }
            }
            let row = this.tableDOM.insertRow(i + 1);
            for (let j = 0; j <= this.matrix[i].length; j++) {
                let cell = row.insertCell(j)
                if (j === 0) {
                    cell.className = 'letters'
                    cell.innerHTML = this.letters(i)
                } else {
                    cell.className = 'cell'
                    cell.addEventListener("click", () => {
                        if (this.matrix[i][j - 1] === 'X') {
                            if (cell.className === 'cell') {
                                this.moralSupportDOM.innerHTML = 'You hit a ship!';
                            }
                            cell.className = 'cell-hit';
                            Object.keys(this.coordinates).map(key => this.coordinates[key].map((el, index) => {
                                if (el.row === i && el.column === j - 1) {
                                    this.coordinates[key].splice(index, 1)
                                }
                                if (this.coordinates[key].length === 0) {
                                    this.moralSupportDOM.innerHTML = 'You sunk a ship!';
                                    delete this.coordinates[key];
                                    shipsLeftDom.innerHTML = `Ships down: ${this.ships.length - Object.keys(this.coordinates).length}/${this.ships.length}`
                                }
                                if (Object.keys(this.coordinates).length === 0) {
                                    this.tableDOM.className = 'disabled';
                                    this.moralSupportDOM.innerHTML = 'You win!';
                                }
                            }))
                        } else {
                            if (cell.className === 'cell') {
                                this.clickCount--;
                                this.moralSupportDOM.innerHTML = 'Just water here';
                            }
                            cell.className = 'cell-miss';
                        }
                        if (this.clickCount > 0) {
                            clicksLeftDOM.innerHTML = `You have ${this.clickCount} clicks left!`;
                        } else {
                            clicksLeftDOM.innerHTML = `You have ${this.clickCount} clicks left!`;
                            this.tableDOM.className = 'disabled';
                            this.moralSupportDOM.innerHTML = 'You lose';
                        }
                    });
                }
            }
        }
    }
    newBtn() {
        let newGameBtn = document.getElementById("new-game");
        newGameBtn.addEventListener("click", () => {
            this.tableDOM.innerHTML = ""
            this.moralSupportDOM.innerHTML = ""
            this.tableDOM.className = "";
            newGame()
        });
    }
    letters(n) {
        let character = 65;
        let letters = []
        let loops = -1;
        while (n >= 0) {
            if (n < 26) {
                loops == -1 ?
                    letters.push(String.fromCharCode(n + character)) :
                    letters.push(String.fromCharCode(loops + character), String.fromCharCode(n + character))
            }
            n -= 26;
            loops++;

        }
        return letters.join('')
    }
    init() {
        return new Array(this.size).fill('').map(() => [...new Array(this.size).fill('')])
    }
};
function newGame() {
    let game = new Game(10);
    game.placeShips();
    game.createTable();
    game.newBtn();
}
newGame();