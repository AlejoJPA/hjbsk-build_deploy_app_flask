/*
//Original code
let runAddition = () => {
    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);

    let result = num1 + num2;
    document.getElementById("system_response").innerHTML = "Result: " + result;
};

let runSubtraction = () => {
    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);
    
    let result = num1 - num2;
    document.getElementById("system_response").innerHTML = "Result: " + result;
};

let runMultiplication = () => {
    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);
    
    let result = num1 * num2;
    document.getElementById("system_response").innerHTML = "Result: " + result;
};

*/

//FIX 19/02/25

/*Changes and Fixes in the Code

    Replaced direct JavaScript calculations with fetch requests to the Flask backend.
    Handles both success and error responses:
        If the backend returns an error (400 Bad Request), it will display the error message in red.
        If the backend returns a result, it will display the result normally.
    Validates input before making a request, preventing empty values from being sent.
    Uses response.text() instead of response.json(), since the Flask backend returns plain text results (e.g., "5" instead of {"result": 5}).

    fetch(url)	Makes a GET request.
    then(response => response.json())	Converts the response to JSON.
    then(response => response.text())	Reads the response as text (useful for Flask).
    catch(error => console.error(error))	Catches network or processing errors.
    method: "POST"	Sends data to the server.
    headers: { "Content-Type": "application/json" }	Specifies that the request is JSON.
    body: JSON.stringify(data)	Converts an object to JSON before sending.
*/

// Function to display messages
let showMessage = (message, isError = false) => {
    let responseElement = document.getElementById("system_response");
    responseElement.innerHTML = isError
        ? `<span style="color: red;">Error: ${message}</span>`
        : `Result: ${message}`;
};

// Function to send a request to Flask API
let sendRequest = (operation) => {
    let num1 = document.getElementById("num1").value.trim();
    let num2 = document.getElementById("num2").value.trim();

    // Validate input before sending request
    if (num1 === "" || num2 === "") {
        showMessage("Both numbers must be provided.", true);
        return;
    }

    // Construct the API URL
    let url = `/${operation}?num1=${encodeURIComponent(num1)}&num2=${encodeURIComponent(num2)}`;

    // Make the request to the Flask API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // If response status is not 200, process error
                return response.json().then(err => { throw new Error(err.error); });
            }
            return response.text(); // Read response as plain text (not JSON)
        })
        .then(data => {
            // Display the result
            showMessage(data);
        })
        .catch(error => {
            // Handle errors and display them
            showMessage(error.message || "Unexpected error occurred.", true);
        });
};

// Function bindings
let runAddition = () => sendRequest("sum");
let runSubtraction = () => sendRequest("sub");
let runMultiplication = () => sendRequest("mul");
