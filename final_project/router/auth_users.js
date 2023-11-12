const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty" });
    }

    // Get the user from the session
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the book exists
    if (books.hasOwnProperty(isbn)) {
        // Check if the user has already reviewed this book
        if (books[isbn].reviews.hasOwnProperty(username)) {
            // Modify existing review
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Review modified successfully" });
        } else {
            // Add a new review
            books[isbn].reviews[username] = review;
            return res.status(201).json({ message: "Review added successfully" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

//Deleting user's book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }

    const book = books[isbn];
    const userReview = book.reviews[username];

    if (!userReview) {
        return res.status(404).json({ message: "Review not found for the given user and ISBN" });
    }

    // Delete the review for the given user and ISBN
    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
