const prompt = require('prompt-sync')({
    sigint: true
});
const term = require( 'terminal-kit' ).terminal ;

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field, randomStart, hardMode=false) {
        this._field = field;
        this._randomStart = randomStart;
        this.hardMode = hardMode;
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
        for (let y = 0; y < this._field.length; y++){
            for(let x = 0; x < this._field[0].length; x++){
                if(y === this.y && x === this.x)
                    term.green(pathCharacter);
                else if (this._field[y][x] === pathCharacter)
                    term.magenta(pathCharacter);
                else if(this._field[y][x] === fieldCharacter)
                    term.yellow(fieldCharacter);
                else if(this._field[y][x] === hole)
                    term.red(hole);
                else
                    term.noFormat(hat);
            }
            console.log("");
        }
    }
    isOutOfBounds() {
        return (this.x === -1 || this.x === this._field[0].length || this.y === -1 || this.y === this._field.length);
    }
    isHat() {
        return this._field[this.y][this.x] === hat;
    }
    isHole() {
        return this._field[this.y][this.x] === hole;
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
    makeHole() {
        let randX;
        let randY;
        do{
            randX = Math.floor(Math.random() * this._field[0].length);
            randY = Math.floor(Math.random() * this._field.length);
        } while(this._field[randY][randX] === hole || this._field[randY][randX] === hat || (randX === this.x && randY === this.y))

        this._field[randY][randX] = hole;
    }
    isValidField() {
        let testField = [...this._field];
        let wasHere = [];

        for(let row = 0; row < testField.length; row++){
            let newLine = [];
            for(let col = 0; col < testField[0].length; col++){
                newLine.push(false);
            }
            wasHere.push([...newLine]);
        }

        function findPath(y, x){
            if(testField[y][x] === hat)
                return true;
            if(testField[y][x] === hole || wasHere[y][x])
                return false;

            wasHere[y][x] = true;
            if(y != 0){
                if(findPath(y-1, x)){
                    return true;
                }
            }
            if(y != testField.length - 1){
                if(findPath(y+1, x)){
                    return true;
                }
            }
            if(x != 0){
                if(findPath(y, x-1)){
                    return true;
                }
            }
            if(x != testField[0].length - 1){
                if(findPath(y, x+1)){
                    return true;
                }
            }

            return false;
        };
        return findPath(this.y, this.x);
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
        let turns = 0;
        while (play) {
            console.clear();
            this.print();
            this.askQuestion();
            turns++;

            if (this.isOutOfBounds()) {
                console.log("You went out of bounds. You died.");
                play = false;
                break;
            } else if(this.isHole()){
                console.log('You fell down a hole!!');
                play = false;
                break;
            } else if (this.isHat()) {
                console.log("You found your hat in "+turns+" turns!!!!");
                play = false;
                break;
            }
            
            this._field[this.y][this.x] = pathCharacter;
            if(this.hardMode && turns % 5 === 0)
                this.makeHole();
        }
    }
};

const userY = prompt('How tall of a maze do you want? Minimum of 5: ');
const userX = prompt('How wide of a maze do you want? Minimum of 5: ');
const userHoles = prompt('What percentage of holes do you want? Type number without percentage: ') / 100;
const hardMode = prompt('Do you want to play on HARD MODE? A new hole appears every 5 turns! [Y] for yes or anything else for no: ').toUpperCase() === 'Y' ? true : false;
const userRandom = prompt('Do you want to start at a random position? [Y] for yes or anything else for no: ').toUpperCase() === 'Y' ? true : false;
let myField;

do{
    myField = new Field(Field.generateField(userY, userX, userHoles), userRandom, hardMode);
} while(!myField.isValidField());

myField.playGame();