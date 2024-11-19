class Duck {
    constructor(name, color, age, weight, image = 'duck.svg') {
        this.name = name;
        this.color = color;
        this.age = age;
        this.weight = weight;
        this.image = image;
    }

    // פעולה להצגת פרטי הברווז
    show() {
        const detailsDiv = document.getElementById('duckDetails');
        detailsDiv.style.display = 'block';
        
        // ניקוי תוכן קודם
        detailsDiv.innerHTML = ` 
            <h3>Duck Details:</h3>
            <p><strong>Name:</strong> ${this.name}</p>
            <p><strong>Color:</strong> <span style="display: inline-block; width: 30px; height: 30px; background-color: ${this.color}; border-radius: 50%;"></span></p>
            <p><strong>Age:</strong> ${this.age}</p>
            <p><strong>Weight:</strong> ${this.weight} kg</p>
        `;

        // אם התמונה היא SVG
        if (this.image.endsWith('.svg')) {
            const svgObject = document.createElement('object');
            svgObject.data = this.image;
            svgObject.type = 'image/svg+xml';
            svgObject.style.width = '150px';
            svgObject.style.height = '150px';
            svgObject.onload = () => {
                const svgDoc = svgObject.contentDocument;
                const svgElements = svgDoc.querySelectorAll('*');
                svgElements.forEach(element => {
                    element.setAttribute('fill', this.color); // צביעה של כל האלמנטים
                });
            };
            detailsDiv.appendChild(svgObject); // הוספת ה-SVG ל-DIV
        } else {
            // אם התמונה היא לא SVG, נצבע אותה בצבע שנבחר
            const duckImage = document.createElement('img');
            duckImage.id = "duckImage";
            duckImage.src = this.image;
            duckImage.alt = "Duck Image";
            duckImage.style.width = '150px';
            duckImage.style.height = '150px';
            duckImage.style.marginTop = '10px';
            duckImage.style.filter = `hue-rotate(${this.colorToHue(this.color)}deg)`; // צביעת התמונה בצבע שנבחר

            detailsDiv.appendChild(duckImage); // הוספת התמונה ל-DIV
        }
    }

    // המרה של צבע HEX ל-Hue כדי לשנות את הגוון בתמונה
    colorToHue(color) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let hue;
        if (max === min) {
            hue = 0;
        } else {
            const diff = max - min;
            if (max === r) {
                hue = (g - b) / diff + (g < b ? 6 : 0);
            } else if (max === g) {
                hue = (b - r) / diff + 2;
            } else {
                hue = (r - g) / diff + 4;
            }
            hue *= 60;
        }
        return hue;
    }

    // פעולה להשמעת קול הברווז
    quack() {
        const quackCount = Math.ceil((this.age * this.weight) / 2); // כמות ההדפסות
        const detailsDiv = document.getElementById('duckDetails');
        detailsDiv.innerHTML = `<p>${'Quack '.repeat(quackCount).trim()}</p>`;

        const audio = new Audio('quack_sound.mp3');
        let counter = 0;

        // השמעת הצליל 3 פעמים
        const playQuack = () => {
            if (counter < 3) {
                audio.play();  // השמעת הצליל
                counter++;
                setTimeout(playQuack, 1500); // השמעת הצליל כל 1500 מילישניות
            }
        };

        playQuack(); // קריאה לפונקציה שמנגן את הקול
    }
}

// משתנה לאחסון אובייקט הברווז
let duck;

// פונקציה לבדוק אם קוד צבע HEX תקני
function isValidHex(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

// Update the color input's background when a new color is selected
document.getElementById('color').addEventListener('input', function () {
    this.style.backgroundColor = this.value;
});

// Form submission logic (already present)
document.getElementById('duckForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Read values from the form
    const name = document.getElementById('name').value.trim();
    const color = document.getElementById('color').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);

    // Validate inputs
    if (!name) {
        alert("Please provide a valid name.");
        return;
    }

    if (age <= 0 || isNaN(age)) {
        alert("Please provide a valid age.");
        return;
    }

    if (weight <= 0 || isNaN(weight)) {
        alert("Please provide a valid weight.");
        return;
    }

    if (!isValidHex(color)) {
        alert("Please provide a valid HEX color code.");
        return;
    }

    // Create Duck instance
    duck = new Duck(name, color, age, weight);

    // Hide "Create Duck" button and form
    document.getElementById('createDuckBtn').style.display = 'none';
    document.getElementById('duckDetails').style.display = 'none';

    // Show action buttons
    document.getElementById('buttonsContainer').style.display = 'block';
});

// טיפול בלחיצה על כפתור Show
document.getElementById('showBtn').addEventListener('click', function () {
    const detailsDiv = document.getElementById('duckDetails');
    detailsDiv.innerHTML = ''; // ניקוי תוכן קיים

    // הצגת התמונה הצבועה
    duck.show(); // הצגת פרטי הברווז

    // הצגת ה-DIV מחדש
    detailsDiv.style.display = 'block';
});

// טיפול בלחיצה על כפתור Quack
document.getElementById('quackBtn').addEventListener('click', function () {
    const detailsDiv = document.getElementById('duckDetails');
    detailsDiv.innerHTML = ''; // ניקוי תוכן קיים
    duck.quack(); // הפעלת הצליל והטקסט
});
