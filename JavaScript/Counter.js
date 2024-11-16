export class Counter {
    constructor(initialValue = 0) {
        this.counter = initialValue;
    }

    // Getter for counter
    get currentCount() {
        return this.counter;
    }

    // Setter for counter
    set currentCount(value) {
        if (typeof value === 'number' && value >= 0) {
            this.counter = value;
        } else {
            console.error("Counter value must be a non-negative number.");
        }
    }

    // Increment method
    Increment() {
        this.counter++;
    }

    // Generate an array from 0 to counter-1
    Go() {
        let arrayNum = [];
        for (let i = 0; i <= this.counter; i++) {
            arrayNum.push(i);
        }
        return arrayNum;
    }
}
