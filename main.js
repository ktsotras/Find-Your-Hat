const prompt = require('prompt-sync')({
    sigint: true
});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
        this.x = Math.floor(Math.random() * field[0].length);
        this.y = Math.floor(Math.random() * field.length);
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
        let newField = [];

        for (let j = 0; j < y; j++){
            let newLine = [];
            for (let i = 0; i < x; i++){
                newLine.push(Math.random() >= holes ? fieldCharacter : hole);
            }
            newField.push([...newLine]);
        }


        let hatY = Math.floor(Math.random() * y);
        let hatX = Math.floor(Math.random() * x);

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
                    console.log('You fell down a hole!!');
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



const myField = new Field(Field.generateField(10, 25, .25));


myField.playGame();