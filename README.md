# CMSC 100 Exercise 05 — Establish a Web Server using Express JS

**Name:** Gewell Piñano  
**Course:** CMSC 100  
**Exercise:** Exercise 05 — Establish a Web Server using Express JS

## Description

This project establishes a web server using **Node.js and Express JS**. It allows users to add books and search for books using their ISBN and author.

The book records are stored in a text file called `books.txt`.

## Features

### 1. Add a Book

**Method:** `POST`  
**Route:** `/add-book`

Adds a new book to `books.txt` if all required fields are provided and the ISBN is unique.

Required fields:

- Book name
- ISBN
- Author
- Year Published

The server returns:

```json
{ "success": true }
