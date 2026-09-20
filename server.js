// ==================================================
// 1. IMPORT / SETUP
// ==================================================

// "require()" imports a module/package so we can use its functions.
// Express is used to create our web server and define routes.
const express = require("express");

// "fs" stands for File System. 
// This is a built-in Node.js module that lets us create, read,
// and write files.
const fs = require("fs");

// "express()" creates an Express application.
// "app" will be used to define our POST and GET routes.
const app = express();

// This is the port where our local web server will run.
const PORT = 3000;

// This middleware allows Express to understand JSON data
// sent through a request body.
//
// We need this because /add-book receives the book information
// as a JSON object.
app.use(express.json());


// ==================================================
// 2. POST /add-book
// ==================================================

// "app.post()" creates a POST route.
//
// POST is used here because we are sending a new book
// to the server so that it can be saved.
//
// "/add-book" is the route/address for this operation.
//
// "(req, res) => { ... }" is the function that runs
// whenever someone sends a POST request to /add-book.
app.post("/add-book", (req, res) => {

    // "req.body" contains the JSON data sent by the client.
    const book = req.body;


    // ==================================================
    // 2A. VALIDATE THE BOOK INFORMATION
    // ==================================================

    // The required fields are:
    // 1. book name
    // 2. ISBN
    // 3. author
    // 4. year published
    if (
        typeof book["book name"] === "string" &&
        book["book name"].trim() !== "" &&
        typeof book.isbn === "string" &&
        book.isbn.trim() !== "" &&
        typeof book.author === "string" &&
        book.author.trim() !== "" &&
        typeof book["year published"] === "string" &&
        book["year published"].trim() !== ""
    ) {

        // ==================================================
        // 2B. MAKE SURE books.txt EXISTS
        // ==================================================

        if (!fs.existsSync("books.txt")) {

            // "fs.writeFileSync()" creates/writes a file.
            //
            fs.writeFileSync("books.txt", "");
        }


        // ==================================================
        // 2C. READ THE EXISTING BOOKS
        // ==================================================

        // It only gets the existing data from books.txt.
        const data = fs.readFileSync("books.txt", "utf8");


        // The file contains multiple books separated by new lines.
        const books = data.split("\n");


        // We initially assume that the ISBN does not exist.
        //
        // "let" allows the value of the variable to change later.
        let isbnExists = false;


        // ==================================================
        // 2D. CHECK IF THE ISBN IS ALREADY USED
        // ==================================================

        for (let i = 0; i < books.length; i++) {
            // This prevents the program from processing blank lines.
            if (books[i].trim() !== "") {

                // Each book in books.txt is stored like this:
                //
                // book name,isbn,author,year published
                //
                // "split(',')" separates the information
                // whenever there is a comma.
                const details = books[i].split(",");


                // Check if the ISBN from the existing book
                // is the same as the ISBN of the new book.
                //
                // "details[1]" = existing ISBN
                // "book.isbn.trim()" = new ISBN
                //
                if (details[1] === book.isbn.trim()) {

                    // If they match, the ISBN already exists.
                    //
                    // I change the value from false to true.
                    //
                    // This prevents duplicate ISBNs.
                    isbnExists = true;
                }
            }
        }


        // ==================================================
        // 2E. DECIDE WHETHER TO ADD THE BOOK
        // ==================================================

        // If isbnExists is true, it means the ISBN
        // is already being used by another book.
        if (isbnExists) {

            // "res.json()" sends a JSON response back to the client.
            //
            // Here, success is false because the book
            // was NOT added.
            res.json({ success: false });


        } else {

            // ==================================================
            // 2F. CREATE THE NEW BOOK LINE
            // ==================================================
            // New book is saved in this format:
            // book name,isbn,author,year published
            const newBook =
                book["book name"].trim() + "," +
                book.isbn.trim() + "," +
                book.author.trim() + "," +
                book["year published"].trim() + "\n";


            // ==================================================
            // 2G. THIS IS WHAT ACTUALLY UPDATES books.txt
            // ==================================================

            // "fs.appendFileSync()" adds new text
            // to the END of an existing file.
            //
            // THIS is the line that actually saves the new book
            // into books.txt.
            fs.appendFileSync("books.txt", newBook);


            // Tell the client that the book was successfully added.
            res.json({ success: true });
        }

    } else {

        // If even ONE required field is missing or empty,
        // the book is not added.
        //
        // books.txt is NOT updated here.
        res.json({ success: false });
    }
});


// ==================================================
// 3. GET /find-by-isbn-author
// ==================================================

// This GET route searches for a book using BOTH:
// 1. ISBN
// 2. Author
//
// GET is used because we are requesting/searching for data,
// not adding new data.
app.get("/find-by-isbn-author", (req, res) => {


    // "req.query" contains values found in the URL
    // after the "?".
    const isbn = req.query.isbn;
    const author = req.query.author;


    // Create an empty array.
    //
    // This will store the books that match
    // the requested ISBN and author.
    const results = [];


    // Before reading books.txt, check if the file exists.
    //
    // If the file does not exist, the program simply returns
    // an empty results array instead of trying to read
    // a missing file.
    if (fs.existsSync("books.txt")) {


        // Read the existing books from books.txt.
        const data = fs.readFileSync("books.txt", "utf8");


        // Separate each line/book.
        const books = data.split("\n");


        // Go through every book in the file.
        for (let i = 0; i < books.length; i++) {


            // Ignore empty lines.
            if (books[i].trim() !== "") {


                // Separate the book's information by commas.
                //
                // details[0] = book name
                // details[1] = ISBN
                // details[2] = author
                // details[3] = year published
                const details = books[i].split(",");


                // Check BOTH conditions.
                //
                // "&&" means AND.
                //
                // The ISBN must match AND the author must match.
                if (
                    details[1] === isbn &&
                    details[2] === author
                ) {


                    // Create a JavaScript object containing
                    // the complete book information.
                    //
                    // The information comes from the details array.
                    const book = {
                        "book name": details[0],
                        "isbn": details[1],
                        "author": details[2],
                        "year published": details[3]
                    };


                    // "push()" adds the matching book
                    // into the results array.
                    results.push(book);
                }
            }
        }
    }


    // Send the results back to the client as JSON.
    //
    // If there are matches -> array contains book objects.
    //
    // If there are no matches -> returns [].
    res.json(results);
});


// ==================================================
// 4. GET /find-by-author
// ==================================================

// This GET route searches for ALL books written by
// a specific author.
app.get("/find-by-author", (req, res) => {


    // Get the author from the URL query parameter.
    //
    // Example:
    // /find-by-author?author=J.K%20Rowling
    //
    // req.query.author -> "J.K Rowling"
    const author = req.query.author;


    // Empty array that will store all matching books.
    const results = [];


    // Check if books.txt exists.
    if (fs.existsSync("books.txt")) {


        // Read the existing contents of books.txt.
        //
        // Again, this only READS the file.
        const data = fs.readFileSync("books.txt", "utf8");


        // Separate the file into individual book lines.
        const books = data.split("\n");


        // Check every book.
        for (let i = 0; i < books.length; i++) {


            // Skip empty lines.
            if (books[i].trim() !== "") {


                // Separate the four book fields.
                const details = books[i].split(",");


                // Only check the AUTHOR this time.
                //
                // details[2] is the author field.
                if (details[2] === author) {


                    // Reconstruct the matching book
                    // as a JavaScript object.
                    const book = {
                        "book name": details[0],
                        "isbn": details[1],
                        "author": details[2],
                        "year published": details[3]
                    };


                    // Add the matching book to results.
                    results.push(book);
                }
            }
        }
    }


    // Return all books written by the requested author.
    res.json(results);
});


// ==================================================
// 5. START THE SERVER
// ==================================================

// "app.listen()" starts the Express server.
//
// PORT = 3000, so our server becomes available at:
// http://localhost:3000
//
// The function inside "() => { }" runs once
// when the server successfully starts.
app.listen(PORT, () => {

    // "console.log()" prints a message in the terminal.
    console.log("Server is running on http://localhost:" + PORT);
});
