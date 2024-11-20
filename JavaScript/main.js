import { Counter } from "./Counter.js";
import { Clock } from "./Clock.js";
import { Point } from "./Point.js";

function ExistCord(pointArray, x, y) {
    return pointArray.some(point => point.x === x && point.y === y);
}

function ExistPoint(pointArray, pCheck) {
    return pointArray.some(point => point.equals(pCheck));
}

function calculateTotalDistance(pointArray) {
    let totalDistance = 0;

    for (let i = 0; i < pointArray.length - 1; i++) {
        const dx = pointArray[i + 1].x - pointArray[i].x; // Difference in x-coordinates
        const dy = pointArray[i + 1].y - pointArray[i].y; // Difference in y-coordinates
        const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance
        totalDistance += distance; // Add to total distance
    }

    return totalDistance;
}


$(document).ready(function () {
    var count = new Counter();  // Create a new Counter instance
    var clockArray = []; // create new Clock array
    const rawPoints = [
        { x: 0, y: 5 },
        { x:2, y: 2},
        { x: 3, y: 4 },
        { x: 6, y: 10 }
    ];
    
    // Convert plain objects to Point instances
    const points = rawPoints.map(({ x, y }) => new Point(x, y));

    if (window.location.pathname.includes("point.html")) {

        if (ExistCord(points, 2, 2)) {
            console.log("cord");
        }

        if (ExistPoint(points, new Point(3, 4))) {
            console.log("point");
        }


        // Generate the points display
        const pointsHtml = points
            .map(point => point.show()) // Convert each point to a string
            .join(" → "); // Join points with an arrow

        // Calculate the total distance
        const totalDistance = calculateTotalDistance(points);

        // Set the content of the #pointRoute element
        $("#pointRoute").text(`${pointsHtml} (Total Distance: ${totalDistance.toFixed(2)})`);
    }

    // When the "initialize" button is clicked
    $("#initialize").click(function () {
        let counterNum = parseInt($("#counter").val(), 10);  // Get the value and convert it to a number
        count.currentCount = counterNum;  // Set the counter using the setter
    });

    // When the "increment" button is clicked
    $("#increment").click(function () {
        count.Increment();  // Increment the counter
        $("#counter").val(count.currentCount);  // Set the input field value using the getter
    });

    $("#printNums").click(function () {
        let arrayNum = count.Go();  // Get the array of numbers from the counter

        // Convert the array of numbers into a single string, separated by spaces
        let numString = arrayNum.join(' ');

        // Clear the existing content in #numsGo (optional)
        $("#numsGo").empty();

        // Create a new paragraph and append the concatenated numbers
        $("#numsGo").append("<p>" + numString + "</p>");
    });

    $("#sendFormat").click(function () {
        const hours = $("#hours").val();
        const minutes = $("#minutes").val();
        const seconds = $("#seconds").val();
        const country = $("#country").val();
    
        try {
            const newClock = new Clock();
            newClock.hours = parseInt(hours, 10);    // Using setter to validate hours
            newClock.minutes = parseInt(minutes, 10); // Using setter to validate minutes
            newClock.seconds = parseInt(seconds, 10); // Using setter to validate seconds
            newClock.countryName = country;           // Using setter to validate country name
    
            clockArray.push(newClock);
    
            if (clockArray.length % 5 == 0) {
                $("#infoDiv").append("<p> The country Name: " + newClock.countryName + ". The time is: " + newClock.show()
                    + ". The time in seconds is: " + newClock.ConverToSeconds() + "</p>");
            }
    
            // Clear all input fields
            $("#hours").val('');
            $("#minutes").val('');
            $("#seconds").val('');
            $("#country").val('');
        } catch (error) {
            // Handle validation errors, e.g., display a message to the user
            alert(error.message);
        }
    });
});

