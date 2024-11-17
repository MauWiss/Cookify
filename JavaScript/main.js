import { Counter } from "./Counter.js";
import { Clock } from "./Clock.js";

$(document).ready(function () {
    var count = new Counter();  // Create a new Counter instance
    var clockArray = []; // create new Clock array

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

        const newClock = new Clock(
            parseInt(hours, 10),
            parseInt(minutes, 10),
            parseInt(seconds, 10),
            country
        );

        clockArray.push(newClock);

        if (clockArray.length % 5 == 0) {
            $("#infoDiv").append("<p> The country Name: " + newClock.countryName+ ". The time is: " + newClock.show()
            +". The time is seconds is: " + newClock.ConverToSeconds() + "</p>");
        }

        // Clear all input fields
        $("#hours").val('');
        $("#minutes").val('');
        $("#seconds").val('');
        $("#country").val('');

    })

});
