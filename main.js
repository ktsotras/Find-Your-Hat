const prompt = require('prompt-sync')({
    sigint: true
});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field, y=0, x=0) {
        this._field = field;
        this.x = x;
        this.y = y;
        this._field[this.y][this.x] = pathCharacter;
    }
    print() {
        for (let i = 0; i < this._field.length; i++)
            console.log(this._field[i].join(''));
    }
    isOutOfBounds() {
        return (this.x === -1 || this.x === this._field[0].length || this.y === -1 || this.y === this._field.length);
    }
    askQuestion() {
        const userInput = prompt('Which direction do you want to go? Enter U, D, L, or R: ').toUpperCase();
        switch (userInput) {
            case 'U':
                this.y--;
                break;
            case 'D':
                this.y++;
                break;
            case 'L':
                this.x--;
                break;
            case 'R':
                this.x++;
                break;
            default:
                this.askQuestion();
                break;
        }
    }
    static generateField(y, x, holes = 0.1) {
        if (y < 5 || x < 5) {
            console.log('Error: Field parameters too small')
            return;
        }
        let totalHoles = x * y * holes;
        let newField = [];
        let newLine = [];

        const randY = pad => {
            return Math.floor(Math.random() * (y - pad)) + pad;
        }
        const randX = pad => {
            return Math.floor(Math.random() * (x - pad)) + pad;
        }

        for (let i = 0; i < x; i++)
            newLine.push(fieldCharacter);

        for (let j = 0; j < y; j++)
            newField.push([...newLine]);

        for (let k = 0; k < totalHoles; k++) {
            let holeY = 0
            let holeX = 0;
            do {
                holeY = randY(1);
                holeX = randX(1);
                if (newField[holeY][holeX] != hole)
                    newField[holeY][holeX] = hole;
            } while (newField[holeY][holeX] != hole)
        }
        let hatY = randY(2);
        let hatX = randX(2);

        newField[hatY][hatX] = hat;

        return newField;
    }
    playGame() {
        let play = true;
        while (play) {
            console.clear();
            this.print();
            this.askQuestion();

            if (this.isOutOfBounds()) {
                console.log("You went out of bounds. You died.");
                play = false;
                break;
            } else {
                let currentLocationCharacter = this._field[this.y][this.x];
                if (currentLocationCharacter === 'O') {
                    console.log('You fell down a hole you moron.');
                    play = false;
                    break;
                }
                if (currentLocationCharacter === '^') {
                    console.log("You found your hat!!!!");
                    play = false;
                    break;
                }
            }
            this._field[this.y][this.x] = pathCharacter;
        }
    }
};



const myField = new Field(Field.generateField(10, 10, .25));


myField.playGame();