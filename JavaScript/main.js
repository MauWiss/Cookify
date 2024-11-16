import { Counter } from "./Counter.js";

$(document).ready(function() {
    var count = new Counter();  // Create a new Counter instance

    // When the "initialize" button is clicked
    $("#initialize").click(function() {
        let counterNum = parseInt($("#counter").val(), 10);  // Get the value and convert it to a number
        count.currentCount = counterNum;  // Set the counter using the setter
    });

    // When the "increment" button is clicked
    $("#increment").click(function() {
        count.Increment();  // Increment the counter
        $("#counter").val(count.currentCount);  // Set the input field value using the getter
    });

    $("#printNums").click(function() {
        let arrayNum = count.Go();  // Get the array of numbers from the counter
    
        // Convert the array of numbers into a single string, separated by spaces
        let numString = arrayNum.join(' ');
    
        // Clear the existing content in #numsGo (optional)
        $("#numsGo").empty();
    
        // Create a new paragraph and append the concatenated numbers
        $("#numsGo").append("<p>" + numString + "</p>");
    });
    
});
