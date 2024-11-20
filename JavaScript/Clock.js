export class Clock {
    constructor(hours = 0, minutes = 0, seconds = 0, countryName = "") {
        this._hours = hours;
        this._minutes = minutes;
        this._seconds = seconds;
        this._countryName = countryName;
    }

    // Getters
    get hours() {
        return this._hours;
    }

    get minutes() {
        return this._minutes;
    }

    get seconds() {
        return this._seconds;
    }

    get countryName() {
        return this._countryName;
    }

    // Setters
    set hours(value) {
        if (value >= 0 && value < 24) {
            this._hours = value;
        } else {
            throw new Error("Hours must be between 0 and 23.");
        }
    }

    set minutes(value) {
        if (value >= 0 && value < 60) {
            this._minutes = value;
        } else {
            throw new Error("Minutes must be between 0 and 59.");
        }
    }

    set seconds(value) {
        if (value >= 0 && value < 60) {
            this._seconds = value;
        } else {
            console.log("Seconds must be between 0 and 59.")
            throw new Error("Seconds must be between 0 and 59.");
        }
    }

    set countryName(value) {
        if (typeof value === 'string' && value.trim().length > 0) {
            this._countryName = value;
        } else {
            throw new Error("Country name must be a non-empty string.");
        }
    }

    // Converts time to seconds
    ConverToSeconds() {
        return this._hours * 3600 + this._minutes * 60 + this._seconds;
    }

    // Returns time in hh:mm:ss format
    show() {
        const formattedHours = String(this._hours).padStart(2, '0');
        const formattedMinutes = String(this._minutes).padStart(2, '0');
        const formattedSeconds = String(this._seconds).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
}