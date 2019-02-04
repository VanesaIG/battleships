class Game {
    constructor(size) {
        this.size = size
        this.matrix = this.init()
        this.ships = [4, 3, 3, 2, 2]
        this.placedShips = 0;
        this.clickCount = 10;
        this.coordinates = {};
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
                        this.coordinates[loop].push({row: row, column: i})
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
                        this.coordinates[loop].push({row: i, column: column})
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
        let moralSupportDOM = document.getElementById('moral-support');
        let tableDOM = document.getElementById('table');
        let table = document.getElementById("table");
        clicksLeftDOM.innerHTML = `You have ${this.clickCount} clicks left!`;
        for (let i = 0; i < this.matrix.length; i++) {
            if (i === 0) {
                let row = table.insertRow(i)
                for (let j = 0; j <= this.matrix[i].length; j++) {
                    let cell = row.insertCell(j)
                    cell.className = 'numbers'
                    j > 0 ? cell.innerHTML = j : cell.innerHTML = ''
                }
            }
            let row = table.insertRow(i+1)
            for (let j = 0; j <= this.matrix[i].length; j++) {
                let cell = row.insertCell(j)
                if (j === 0) {
                    cell.className = 'letters'
                    cell.innerHTML = this.letters(i)
                } else {
                    cell.className = 'cell'
                    cell.addEventListener("click", () => {
                        if (this.matrix[i][j] === 'X') {
                            if (cell.className === 'cell') {
                                moralSupportDOM.innerHTML = 'You hit a boat!';
                            }
                            cell.className = 'cell-hit';
                        } else {
                            if (cell.className === 'cell') {
                                this.clickCount--;
                                moralSupportDOM.innerHTML = 'Just water here';
                            }
                            cell.className = 'cell-miss';
                        }
                        if (this.clickCount > 0) {
                            clicksLeftDOM.innerHTML = `You have ${this.clickCount} clicks left!`;
                        } else {
                            clicksLeftDOM.innerHTML = `You have ${this.clickCount} clicks left!`;
                            tableDOM.className = 'disabled';
                            moralSupportDOM.innerHTML = 'You lose';
                        }
                    });
                }
            }
        }
    }
    letters(n) {
        let character = 65;
        let letters = []
        let loops = -1;
        while (n >= 0) {
            if(n < 26) {
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

let a = new Game(10);
a.placeShips();
a.createTable();