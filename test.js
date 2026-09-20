// ==================================================
// test.js
// ==================================================
//
// This file is used to TEST the routes created in server.js.

// ==================================================
// 1. SERVER URL
// ==================================================

// This stores the address of our local Express server.
//
// "localhost" means our own computer.
//
// ":3000" is the port where server.js is running.
//
// So this:
// http://localhost:3000
//
// is the base URL that we use when sending requests.
const SERVER_URL = "http://localhost:3000";


// ==================================================
// 2. TEST POST /add-book
// ==================================================
//
// This function tests the POST /add-book route.
//
// Its purpose is to send a new book to server.js.
//
// IMPORTANT:
// This function itself does NOT directly write to books.txt.
//
// It sends the book to:
// POST /add-book
//
// Then server.js decides whether the book should be
// saved to books.txt.


// "async" allows us to use "await" inside the function.
//
// We use "async" because sending a request takes time.
// The program has to wait for the server to respond.
async function addBook() {


    // ==================================================
    // 2A. CREATE THE BOOK DATA
    // ==================================================

    // This is a JavaScript object containing the book information
    // that we want to send to the server.
    //
    // The property names match the required fields
    // in the exercise:
    //
    // "book name"
    // "isbn"
    // "author"
    // "year published"
    const book = {
        "book name": "Harry Potter and the Sorcerer's Stone",
        "isbn": "978-0-7475-3269-9",
        "author": "J.K Rowling",
        "year published": "1997"
    };


    // ==================================================
    // 2B. SEND THE BOOK TO THE SERVER
    // ==================================================

    // "fetch()" sends a request to a URL.
    //
    // SERVER_URL + "/add-book"
    // becomes:
    //
    // http://localhost:3000/add-book
    //
    // "await" means:
    // wait for the server to respond before continuing.
    //
    // The response from the server is stored in "response".
    const response = await fetch(SERVER_URL + "/add-book", {


        // Tell fetch that we are using a POST request.
        //
        // POST is used because we are sending a new book
        // to the server.
        method: "POST",


        // ==================================================
        // 2C. TELL THE SERVER WE ARE SENDING JSON
        // ==================================================

        // "headers" provides additional information about
        // the request.
        //
        // "Content-Type: application/json" tells the server:
        //
        // "The data I am sending is JSON."
        headers: {
            "Content-Type": "application/json"
        },


        // ==================================================
        // 2D. CONVERT THE OBJECT INTO JSON
        // ==================================================

        // "JSON.stringify(book)"
        // converts the JavaScript object "book"
        // into JSON text that can be sent in the request body.
        //
        // Example:
        //
        // JavaScript object:
        // {
        //     "book name": "...",
        //     "isbn": "..."
        // }
        //
        // becomes JSON text that can be sent to the server.
        //
        // IMPORTANT:
        // This is the data that server.js receives through:
        //
        // req.body
        body: JSON.stringify(book)
    });


    // ==================================================
    // 2E. GET THE SERVER'S RESPONSE
    // ==================================================

    // The server sends a JSON response back.
    //
    // "response.json()"
    // reads that response and converts it into
    // a JavaScript value/object.
    //
    // For a successful add:
    //
    // { success: true }
    //
    // For a failed add:
    //
    // { success: false }
    const result = await response.json();


    // Display a label in the terminal
    // so we know which test produced the result.
    console.log("Add Book Result:");


    // Display the actual response from the server.
    console.log(result);
}


// ==================================================
// 3. TEST GET /find-by-isbn-author
// ==================================================
//
// This function tests the GET route that searches
// for a book using BOTH:
// 1. ISBN
// 2. Author
//
// IMPORTANT:
// This route only searches/reads the data.
// It does NOT add or modify books.txt.
async function findByISBNAndAuthor() {


    // ==================================================
    // 3A. SEND THE GET REQUEST
    // ==================================================

    // "fetch()" sends a GET request by default
    // because we did not specify a method.
    //
    // The URL becomes:
    //
    // http://localhost:3000/find-by-isbn-author
    // ?isbn=978-0-7475-3269-9
    // &author=J.K%20Rowling
    //
    // The "?" starts the query parameters.
    //
    // "isbn=..." gives the ISBN.
    //
    // "&" separates one query parameter from another.
    //
    // "author=..." gives the author.
    //
    // "%20" represents a SPACE in a URL.
    //
    // So:
    // J.K%20Rowling
    //
    // means:
    // J.K Rowling.
    const response = await fetch(
        SERVER_URL +
        "/find-by-isbn-author?isbn=978-0-7475-3269-9&author=J.K%20Rowling"
    );


    // Get the JSON data returned by the server.
    //
    // The server will return an array of matching books.
    //
    // Example:
    //
    // [
    //     {
    //         "book name": "...",
    //         "isbn": "...",
    //         "author": "...",
    //         "year published": "..."
    //     }
    // ]
    const result = await response.json();


    // Display a label so we know which test
    // produced the output.
    console.log("Find by ISBN and Author Result:");


    // Display the actual search results.
    console.log(result);
}


// ==================================================
// 4. TEST GET /find-by-author
// ==================================================
//
// This function tests the route that searches
// for books using the author.
//
// Example:
// Find all books written by J.K Rowling.
//
// Like the previous GET route,
// this does NOT modify books.txt.
async function findByAuthor() {


    // ==================================================
    // 4A. SEND THE GET REQUEST
    // ==================================================

    // The URL becomes:
    //
    // http://localhost:3000/find-by-author
    // ?author=J.K%20Rowling
    //
    // The "?" starts the query parameter.
    //
    // "author=" tells the server which author
    // we want to search for.
    const response = await fetch(
        SERVER_URL + "/find-by-author?author=J.K%20Rowling"
    );


    // Convert the server's JSON response
    // into a JavaScript value.
    const result = await response.json();


    // Display a label for this test.
    console.log("Find by Author Result:");


    // Display all matching books.
    console.log(result);
}


// ==================================================
// 5. RUN ALL TESTS
// ==================================================
//
// Defining a function does NOT automatically run it.
//
// We need to CALL the functions.
//
// We start with addBook() because we want to add
// the test book before trying to search for it.


// Call addBook() first.
addBook()


    // ==================================================
    // 5A. AFTER addBook() FINISHES
    // ==================================================

    // ".then()" means:
    //
    // "After the previous asynchronous operation finishes,
    // run this next function."
    //
    // So after the book is added,
    // search for it using ISBN + Author.
    .then(() => findByISBNAndAuthor())


    // ==================================================
    // 5B. AFTER THE FIRST SEARCH FINISHES
    // ==================================================

    // After the ISBN + Author search finishes,
    // search again using only the author.
    .then(() => findByAuthor())


    // ==================================================
    // 5C. HANDLE ERRORS
    // ==================================================

    // ".catch()" runs if an error happens
    // somewhere in the promise chain.
    //
    // "error" contains information about the error.
    .catch((error) => {

        // Display an error message.
        console.log("An error occurred:");

        // Display the actual error details.
        console.log(error);
    });

