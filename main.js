const prompt = require('prompt-sync')({
    sigint: true
});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field, randomStart) {
        this._field = field;
        this._randomStart = randomStart;
        if(this._randomStart){
            do{
                this.x = Math.floor(Math.random() * field[0].length);
                this.y = Math.floor(Math.random() * field.length);
            } while(this._field[this.y][this.x] === hat)
        }
        else{
            this.x = 0;
            this.y = 0;
        }
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
    isValidField() {
        return true;
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
        let hatY;
        let hatX;
        do{
            hatY = Math.floor(Math.random() * y);
            hatX = Math.floor(Math.random() * x);
        } while(!this._randomStart && (hatY + hatX) === 0)

        newField[hatY][hatX] = hat;

        return newField;
    }
    playGame() {
        let play = true;
        while (play) {
            console.clear();
            while(!this.isValidField){
                this._field 
            }
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


const userRandom = prompt('Do you want to start at a random position? [Y] or [N]: ').toUpperCase() === 'Y' ? true : false;
let myField;
const testField = [
    ['░', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ];
do{
    myField = new Field(Field.generateField(10, 10, 0.2), userRandom);
} while(!myField.isValidField());


myField.playGame();